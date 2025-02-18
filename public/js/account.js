// "use strict";

// // Get a list of accounts based
// let accountList = document.querySelector("#accountList");
// accountList.addEventListener("change", function () {
//   let userId = accountList.value;
//   console.log(`User ID is: ${userId}`);
//   let userIdURL = new URL("/account/getAccount", window.location.origin);
//   userIdURL.searchParams.set("id", userId);

//   fetch(userIdURL)
//     .then(function (response) {
//       if (response.ok) {
//         return response.json();
//       }
//       throw Error("Network response was not OK");
//     })
//     .then(function (data) {
//       if (data) {
//         console.log(data);
//         buildAccountList(data);
//       } else {
//         console.log("No data returned");
//       }
//     })
//     .catch(function (error) {
//       console.log("There was a problem: ", error.message);
//       let accountDisplay = document.getElementById("accountDisplay");
//       accountDisplay.textContent = "An error occurred. Please try again.";
//     });
// });

// // Build account information into HTML components and inject into DOM
// function buildAccountList(data) {
//   let accountDisplay = document.getElementById("accountDisplay");
//   // Set up the account labels
//   let accountData = document.createElement("div");
//   accountData.innerHTML = `
//     <h2>Account Information</h2>
//     <p>Name: ${data.name}</p>
//     <p>Email: ${data.email}</p>
//     <p>Account Type: ${data.accountType}</p>
//     <a href='/account/edit/${data.id}' title='Click to update'>Modify</a>
//     <a href='/account/delete/${data.id}' title='Click to delete'>Delete</a>
//   `;

//   // Sanitize the input data
//   accountData.innerHTML = DOMPurify.sanitize(accountData.innerHTML);

//   // Display the contents in the Account Management view
//   accountDisplay.appendChild(accountData);
// }
