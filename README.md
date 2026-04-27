# Egypt Unlocked

Egypt Unlocked is a web application designed to help tourists find places to visit in Egypt while entertaining them through challenges and earning points that eventually can be redeemed for a discount or a voucher.

<img width="1763" height="1497" alt="Screenshot_28-4-2026_14214_localhost" src="https://github.com/user-attachments/assets/40d710dd-67ab-4597-b1cc-f58e272d2000" />

## Components

Egypt Unlocked consists of two main components:
1) Angular Frontend: responsible for the user interface and games
2) Flask Backend: responsible for most of the business logic and ai related features

## Workflow

1) The user logins/registers in our website
2) The user optionally enters a city and an interest
3) The user clicks 'Start Game'
4) The city and the interest go to the backend to be processed
5) This data now goes through our researcher AI LLM-powered agent made by crewai library (This agent will research for places matching the user criteria and output a json string containing up to 10 places, each place contains a google maps link, city, place name, crowdness, etc...). The agent has the ability to search and scrap data from the internet so that it can gain better results, this helps in finding hidden gems and finding if the place is crowded or not
6) The user recieves the data and as challenges. Each challenge is completed by visiting the place of the challenge, which will reward him points
