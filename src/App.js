import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PeerReviewContract from "./contracts/Peer.json";
import "./app1.css";

const App = () => {
  const [paperTitle, setPaperTitle] = useState("");
  const [paperAuthor, setPaperAuthor] = useState("");
  const [paperContent, setPaperContent] = useState("");
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [paperID, setPaperID] = useState(0);
  const [status, setStatus] = useState(0);
  const [showPaperID, setShowPaperID] = useState();
  const [paperDetails, setPaperDetails] = useState({});
  const [ID, setID] = useState();

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          // const web3 = new Web3(window.ethereum);
          const ganacheProvider = new Web3(window.ethereum);
          const web3Instance = new Web3(ganacheProvider);
          await window.ethereum.enable();
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PeerReviewContract.networks[networkId];
          const accounts = await web3Instance.eth.getAccounts();
          // console.log(accounts);
          const peerReviewContract = new web3Instance.eth.Contract(
            PeerReviewContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(peerReviewContract);
          const currentAccount =
            web3Instance.eth.currentProvider.selectedAddress;
          setAccount(currentAccount);
          console.log(account);
        } else {
          console.log("MetaMask not detected");
        }
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);

  const showCurrentID = async () => {
    try {
      const currID = await contract.methods.paperCount();
      setID(currID);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmission = async () => {
    try {
      // const accounts = await contract.eth.getAccounts();
      await contract.methods
        .submitPaper(paperTitle, paperAuthor, paperContent)
        .send({ from: account });
    } catch (err) {
      console.log(err);
    }
    showCurrentID();
  };

  const handleReview = async () => {
    try {
      await contract.methods
        .reviewPaper(paperID, status)
        .send({ from: account });
    } catch (err) {
      console.log(err);
    }
  };

  const handleShow = async (e) => {
    e.preventDefault();
    try {
      // paperId = 1
      await contract.methods
        .papers(showPaperID)
        .call()
        .then((result) => {
          // console.log(result);
          setPaperDetails(result);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowChange = (e) => {
    setShowPaperID(e.target.value);
  };

  return (
    <div className="page">
      <div className="peer-review-block">
        <h1>Peer Review System using Blockchain Technology</h1>
        <center><h2>Submit a Paper for REVIEW</h2></center>
        <form onSubmit={handleSubmission}>
          <label>
            Title:
            <input
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
            />
          </label>
          <br />
          <label>
            Author:
            <input
              type="text"
              value={paperAuthor}
              onChange={(e) => setPaperAuthor(e.target.value)}
            />
          </label>
          <br />
          <label>
            Content:
            <textarea
              value={paperContent}
              onChange={(e) => setPaperContent(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Submit Paper</button>
        </form>
        {ID && <p>The ID for this paper is: {ID}</p>}
      </div>
      <div className="review-paper">
        <h2>Review a Paper</h2>
        <label>
          Enter paper ID : &nbsp;
          <input
            type="number"
            placeholder="ID"
            onChange={(e) => setPaperID(e.target.value)}
          />
        </label>

        <label>
          {" "}
          Give Status Code : &nbsp;
          <input
            type="number"
            placeholder="status"
            onChange={(e) => setStatus(e.target.value)}
          />
        </label>

        <br></br>

        <button type="submit" onClick={handleReview}>
          Review the paper
        </button>
        <br></br>

        
      </div>
      <div class="review-paper">
        <h2>Check details of a Paper</h2>
          <form onSubmit={handleShow}>
            <label>
              Enter paperID : &nbsp;&nbsp;
              <input
                type="number"
                placeholder="ID"
                value={showPaperID}
                onChange={handleShowChange}
              />
            </label>

            <button type="submit">Enter Paper ID to show details</button>
          </form>
        </div>
      {Object.keys(paperDetails).length != 0 && (
        <div className="paper-details">
          <h2>Paper Details: </h2>
          <p>Paper Title: {paperDetails.title}</p>
          <p>Paper Author: {paperDetails.author}</p>
          <p>Paper Content: {paperDetails.content}</p>
          <p>
            Status(2 for accepted, 3 for rejected, 1 for under review):{" "}
            {paperDetails.status}
          </p>
          <p>Number of total reviews: {paperDetails.reviewCount}</p>
          {paperDetails.reviewCount == 5 && (
            <p>This paper cannot be further reviewed</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
