#include <iostream>
#include <thread>
#include <vector>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <map>
#include <set>
#include <mutex>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

std::vector<std::thread> thread_pool;
std::map<std::string, std::vector<std::string>> user_watched_map; // Map of user IDs to vectors of video IDs they watched
std::mutex map_mutex; // Mutex for thread-safe access to the maps

void printUserWatchedMap() {
    std::lock_guard<std::mutex> lock(map_mutex); // Ensure thread-safe access
    std::cout << "Current state of user_watched_map:" << std::endl;

    for (const auto& entry : user_watched_map) {
        const std::string& user_id = entry.first;
        const std::vector<std::string>& video_list = entry.second;

        std::cout << "User ID: " << user_id << " watched videos: ";
        for (const auto& video_id : video_list) {
            std::cout << video_id << " ";
        }
        std::cout << std::endl;
    }
    std::cout << "---------------------------" << std::endl;
}

std::vector<std::string> getRecommendedVideos(const std::string& user_id, const std::string& video_id) {
    std::vector<std::string> recommended_videos;
    std::set<std::string> unique_videos; // To avoid duplicates in the recommendation list
    std::lock_guard<std::mutex> lock(map_mutex); // Ensure thread-safe access

    // Check if the user has watched any videos
    if (user_watched_map.find(user_id) == user_watched_map.end()) {
        return recommended_videos; // No videos watched, return empty list
    }

    // Find users who watched the same video
    for (const auto& entry : user_watched_map) {
        const std::string& other_user_id = entry.first;
        const std::vector<std::string>& other_user_videos = entry.second;

        if (other_user_id != user_id && std::find(other_user_videos.begin(), other_user_videos.end(), video_id) != other_user_videos.end()) {
            // The other user watched the same video, add their videos to the recommendation list
            for (const auto& other_video : other_user_videos) {
                if (unique_videos.insert(other_video).second) { // Insert and check if it was a new insertion
                    recommended_videos.push_back(other_video);
                }
            }
        }
    }

    // Print the recommended videos before returning
    std::cout << "Recommended videos for user " << user_id << " based on video " << video_id << ": ";
    for (const auto& video : recommended_videos) {
        std::cout << video << " ";
    }
    std::cout << std::endl;
    return recommended_videos;
}

void handleClient(int client_sock, int client_id) {
    std::cout << "Handling client " << client_id << " in thread: " << std::this_thread::get_id() << std::endl;

    char buffer[4096];
    std::string user_id;

    // Receive the user ID from the client first
    memset(buffer, 0, sizeof(buffer));
    int read_bytes = recv(client_sock, buffer, sizeof(buffer), 0);
    if (read_bytes > 0) {
        std::string message(buffer, read_bytes);
        std::cout << "Raw message received from client " << client_id << ": " << message << std::endl;
        user_id = message;
        std::cout << "User ID received: " << user_id << std::endl;
    } else {
        std::cerr << "Failed to receive user ID from client " << client_id << std::endl;
        close(client_sock);
        return;
    }

    // Now, handle communication with the client
    while (true) {
        memset(buffer, 0, sizeof(buffer));
        read_bytes = recv(client_sock, buffer, sizeof(buffer), 0);
        if (read_bytes > 0) {
            std::string message(buffer, read_bytes);
            std::cout << "Received from user " << user_id << " (client " << client_id << "): " << message << std::endl;

            try {
                // Parse the JSON message
                auto json_message = json::parse(message);

                // Check the type of the message
                if (json_message["type"] == "WATCHED_VIDEO") {
                    std::string video_id = json_message["videoId"];
                    std::string user_id = json_message["userId"];
                    {
                        std::lock_guard<std::mutex> lock(map_mutex);
                        user_watched_map[user_id].push_back(video_id);  // Add video ID to the list of videos watched by the user
                        std::cout << "User " << user_id << " watched video " << video_id << std::endl;
                    }
                    printUserWatchedMap();  // Print the map for debugging
                } else if (json_message["type"] == "GET_RECOMMENDATIONS") {
                    std::string video_id = json_message["videoId"];
                    std::cout << "Generating recommendations for user " << user_id << std::endl;

                    std::vector<std::string> recommendations = getRecommendedVideos(user_id, video_id);

                    // Create the response
                    json response_json;
                    response_json["type"] = "RECOMMENDATIONS";
                    response_json["videos"] = recommendations;

                    std::string response = response_json.dump();
                    send(client_sock, response.c_str(), response.size(), 0);
                    std::cout << "Sent recommendations to user " << user_id << ": " << response << std::endl;
                }
            } catch (const std::exception& e) {
                std::cerr << "Failed to parse message as JSON: " << e.what() << std::endl;
            }
        } else if (read_bytes == 0) {
            std::cout << "User " << user_id << " (client " << client_id << ") disconnected." << std::endl;
            break;
        } else {
            perror("Error reading from client");
            break;
        }
    }
    close(client_sock);
}

int main() {
    const int server_port = 5555;
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        std::cerr << "Error creating socket" << std::endl;
        return 1;
    }

    sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(server_port);

    if (bind(sock, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        std::cerr << "Error binding socket" << std::endl;
        close(sock);
        return 1;
    }

    if (listen(sock, 5) < 0) {
        std::cerr << "Error listening on socket" << std::endl;
        close(sock);
        return 1;
    }

    int client_id = 0;
    while (true) {
        sockaddr_in client_addr;
        socklen_t addr_len = sizeof(client_addr);
        int client_sock = accept(sock, (struct sockaddr*)&client_addr, &addr_len);
        if (client_sock < 0) {
            std::cerr << "Error accepting client" << std::endl;
            continue;
        }

        client_id++;
        std::cout << "Client " << client_id << " connected." << std::endl;
        std::thread client_thread(handleClient, client_sock, client_id);
        thread_pool.push_back(std::move(client_thread));
    }

    // Join all threads before exiting
    for (auto& t : thread_pool) {
        if (t.joinable()) {
            t.join();
        }
    }

    close(sock);
    return 0;
}
