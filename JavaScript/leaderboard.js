// Wrap your code in a window.onload event to make sure it runs after the HTML content is loaded
window.onload = function () {
    // Function to dynamically update the leaderboard based on the search input
    function searchLeaderboard() {
        const searchTerm = document.getElementById('search-leaderboard').value.toLowerCase();
        const leaderboardRows = document.querySelectorAll('#leaderboard-body tr');

        leaderboardRows.forEach((row, index) => {
            const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            row.style.display = playerName.includes(searchTerm) ? 'table-row' : 'none';
        });
    }

    // Function to fetch user scores from local storage and update the leaderboard
    function updateLeaderboard() {
        const userScores = JSON.parse(localStorage.getItem('userScores')) || {};
        const leaderboardBody = document.getElementById('leaderboard-body');

        // Clear existing rows
        leaderboardBody.innerHTML = '';

        // Sort users by score in descending order
        const sortedUsers = Object.entries(userScores)
            .sort(([, score1], [, score2]) => score2 - score1);

        // Create and append rows for each user
        sortedUsers.forEach(([username, score], index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${username}</td>
                <td>${score}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }

    // Call the function to update the leaderboard when the page loads
    updateLeaderboard();

    // Make the searchLeaderboard function accessible globally
    window.searchLeaderboard = searchLeaderboard;
};
