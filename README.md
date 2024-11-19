<!--
 \\Author: Thibault Napoléon "Imothep"
 \\Company: ISEN Ouest
 \\Email: thibault.napoleon@isen-ouest.yncrea.fr
 \\Created Date: 16-Sep-2024 - 13:51:38
 \\Last Modified: 19-Nov-2024 - 15:45:40
-->

# Thibault Napoléon website
## Description
The website is designed to present my professional profile, including my biography, research, publications, and teaching activities. The content is dynamically loaded from JSON files and rendered into the HTML structure using JavaScript. The publications list is loaded from HAL archives website through the given API.

## Files
- **index.html**: The main HTML file that structures the webpage.
- **css/**: Contains all the CSS files for styling the website (Bootstrap, icons and style).
- **fonts/**: Contains icons files used in the website.
- **imgs/**: Directory for images used in the website (profile picture).
- **js/**: Contains JavaScript files for dynamic content loading and interaction.
  - **load_json.js**: Main JavaScript file responsible for loading and processing JSON data.
- **json/**: Contains JSON files with data for different sections of the website.
  - **bio.json**: Biography data.
  - **profil.json**: Profile data.
  - **publications.json**: Publications data (filled automatically with HAL archives).
  - **research.json**: Research data.
  - **teaching.json**: Teaching data.

## Development
To modify the website content, update the JSON files in the `json/` directory.

### Libraries
- **Bootstrap**: Used to simplify navbar, grid alignment, badges (https://getbootstrap.com/).
- **Academicons**: Used to display academic social media icons (https://jpswalsh.github.io/academicons/).

*Thibault Napoléon - thibault.napoleon@isen-ouest.yncrea.fr*
