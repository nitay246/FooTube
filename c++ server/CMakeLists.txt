cmake_minimum_required(VERSION 3.15)
project(recommendation_server)

set(CMAKE_CXX_STANDARD 17)

# Find Threads package
find_package(Threads REQUIRED)

# Add the executable
add_executable(recommendation_server recommendation_server.cpp)

# Include directories
target_include_directories(recommendation_server PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
