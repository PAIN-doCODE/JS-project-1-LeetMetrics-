document.addEventListener("DOMContentLoaded", function () {
  const Searchbutton = document.getElementById("Search-btn");
  const Userinput = document.getElementById("user-name");
  const statsContainer = document.querySelector(".stats-div");
  const easyprogresscircle = document.querySelector(".easy-progress");
  const Mediumprogresscircle = document.querySelector(".Medium-progress");
  const Hardprogresscircle = document.querySelector(".Hard-progress");
  const easylabel = document.getElementById("easy-label");
  const mediumlabel = document.getElementById("Medium-label");
  const hardlabel = document.getElementById("Hard-label");
  const statsCardcontainer = document.querySelector(".stats-card");

  // reture true or False on the basis of regex
  function validateusername(username) {
    if (username.trim() === "") {
      alert("username should not be empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]{1,15}$/;

    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchuserDetails(username) {
    try {
      Searchbutton.textContent = "Searching...";
      Searchbutton.disabled = true;
      //statsContainer.classList.add("hidden");

      // const response = await fetch(url);
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://leetcode.com/graphql/";

      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query:
          "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
        variables: { username: `${username}` },
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
      };

      const response = await fetch(proxyUrl + targetUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Unable to fetch the User details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      displayUserData(parsedData);
    } catch (error) {
      statsCardcontainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      Searchbutton.textContent = "Search";
      Searchbutton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressdegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressdegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    const totalQues = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    const totalHardQues = parsedData.data.allQuestionsCount[3].count;

    const solvedTotalQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easylabel,
      easyprogresscircle
    );
    updateProgress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumlabel,
      Mediumprogresscircle
    );
    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardlabel,
      Hardprogresscircle
    );

    const cardsData = [
      {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
      {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
      {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
      {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
  ];
    console.log(cardsData);

    statsCardcontainer.innerHTML = cardsData.map(
data=> 
  `<div class = "card">
<h4>${data.label}</h4>
<p>${data.value}</p>
</div>

`


    ).join("")



  }

  Searchbutton.addEventListener("click", function () {
    const username = Userinput.value;
    console.log("loggin username: ", username);
    if (validateusername(username)) {
      fetchuserDetails(username);
    }
  });
});
