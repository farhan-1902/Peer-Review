//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Peer {
    struct Paper {
        string title;
        string author;
        string content;
        uint256 status; // 0: submitted, 1: under review, 2: accepted, 3: rejected
        uint256 reviewCount;
        address[] hasVoted;
    }
    
    mapping (uint256 => Paper) public papers;
    uint256 public paperCount;
    
    function submitPaper(string memory _title, string memory _author, string memory _content) public payable {
        paperCount++;
        address[] memory hasVoted;
        papers[paperCount] = Paper(_title, _author, _content, 1, 0, hasVoted);
    }
    
    event AcceptedCount(uint256 count);

    function reviewPaper(uint256 _paperId, uint256 _status) public {
        require(_status == 2 || _status == 3, "Invalid status");
        require(papers[_paperId].status == 1, "Paper is not under review");
        require(!reviewExists(_paperId, msg.sender), "You have already reviewed this paper");
        
        papers[_paperId].hasVoted.push(msg.sender);
        papers[_paperId].reviewCount++;

        if (papers[_paperId].reviewCount == 5) {
            uint256 acceptedCount = 0;
            for (uint256 i = 0; i < papers[_paperId].hasVoted.length; i++) {
                if (papers[_paperId].status == 1 && _status == 2) {
                    acceptedCount++;
                }
            }
            
            if((acceptedCount * 4) >= (papers[_paperId].reviewCount * 3)) {
                papers[_paperId].status = 2;
            } else {
                papers[_paperId].status = 3;
            }

        }
        
    }
    
    function reviewExists(uint256 _paperId, address _reviewer) public view returns (bool) {
        for (uint256 i = 0; i < papers[_paperId].hasVoted.length; i++) {
            if (papers[_paperId].hasVoted[i] == _reviewer) {
                return true;
            }
        }
        return false;
    }
}
