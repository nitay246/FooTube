#ifndef APP_H
#define APP_H

#include <string>
#include <iostream>

class App {
public:
    // Default constructor
    App() {
        std::cout << "App initialized successfully." << std::endl;
    }

    std::string processRequest(const std::string& request) {
        return "Request processed: " + request;
    }
};

#endif  // APP_H
