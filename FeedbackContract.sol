// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FeedbackContract {

    struct Feedback {
        address student;
        string facultyName;
        uint8 semester;
        uint8[10] ratings; // Array to hold 10 ratings
        uint256 timestamp;
    }

    Feedback[] public allFeedback;

    mapping (address => bool) public submitted;         // required mapping to check for double submission
    
    event FeedbackSubmitted(
        address indexed student,
        string facultyName,
        uint8 indexed semester,
        uint256 timestamp
    );

    function submitFeedback(string calldata _facultyName, uint8 _semester, uint8[10] calldata _ratings) public {
        // Basic validation
        require(_semester > 0 && _semester <= 8, "Invalid semester");
        for (uint i = 0; i < _ratings.length; i++) {
            require(_ratings[i] >= 1 && _ratings[i] <= 5, "Invalid rating");
        }


        Feedback memory newFeedback = Feedback({
            student: msg.sender,
            facultyName: _facultyName,
            semester: _semester,
            ratings: _ratings,
            timestamp: block.timestamp
        });
        require(!(submitted[msg.sender]),"Student has already submitted Feedback before.");        // avoid double submission
        submitted[msg.sender] = true;  
        allFeedback.push(newFeedback);

        emit FeedbackSubmitted(msg.sender, _facultyName, _semester, block.timestamp);
    }
}