class SpecialHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <a href="index.html">
                    <img class="logo" src="images/logo.png" alt="logo">
                </a>
                <nav>
                    <ul class="nav__links">
                        <li><a href="index.html">Main Page</a></li>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="game.html">Game</a></li>
                        <li><a href="leaderboards.html">Leaderboards</a></li>
                        <li><a href="help.html">Help</a></li>
                    </ul>
                </nav>
                <a class="cta" href="help.html"><button>Contact</button></a>
                <div id="userSection" style="display: none;">
                    <span id="welcomeUser"></span>
                    <button id="logoutButton" onclick="logout()">Logout</button>
                </div>
            </header>
        `;

        const loggedInUser = sessionStorage.getItem('loggedInUser');
        const userSection = this.querySelector('#userSection');

        if (loggedInUser) {
            // If user is logged in, display welcome message and logout button
            userSection.style.display = 'block';
            this.querySelector('#welcomeUser').textContent = `Welcome ${loggedInUser}!`;
        }
    }
}

function logout() {
    // Clear the logged-in user from sessionStorage
    sessionStorage.removeItem('loggedInUser');

    // Redirect the user to the login page
    window.location.href = 'login.html';
}



class SpecialFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="footer">
                    <div class="row">
                        <ul>
                            <li><a href="help.html">Contact us</a></li>
                            <li><a href="game.html">Our Game</a></li>
                            <li><a href="https://www.youtube.com/channel/UCM36IkZ670OerXXU0FtFDgA">Youtube</a></li>
                            <li><a href="https://www.termsfeed.com/blog/legal-requirements-mobile-games/">Terms & Conditions</a></li>
                            <li><a href="https://www.mdx.ac.uk/courses/undergraduate/information-technology">Career</a></li>
                        </ul>
                    </div>
                    ISK GAMEZ LTD Copyright © 2023 Project - Game Design || Designed By: Iskren Ivanov
                </div>
            </footer>
        `;
    }
}

customElements.define('special-header', SpecialHeader);
customElements.define('special-footer', SpecialFooter);
