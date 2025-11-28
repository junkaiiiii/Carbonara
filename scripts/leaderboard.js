const states =[
  users = [
  ]
];

const leaderboard = document.getElementById('leaderboard');
const topThreeLeaderboard = document.getElementById('top3Leaderboard')
const co2 = document.getElementById('co2-kg');
console.log(leaderboard.innerHTML);

// components
const createUserCard = ({username, role, saved_co2},ranking) => {
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="leaderboard-user-card">
    <div class="user-card-left">
      <div class="ranking-div">
        <div class="ranking-circle">
          <p>#${ranking}</p>
        </div>
      </div>

      <div style="flex:6;">
        <p class="username">${username}</p>
        <p class="user-role">${role}</p>
      </div>
    </div>
    
    <div class="user-card-right">
      <p class="stats">${saved_co2}</p>
      <p class="stats-unit">kg CO₂</p>
    </div>
  </div>
  `

  return div.firstElementChild;
}

const createTopThreeCard = ({username}) =>{
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="top-3-user-card">
        <p class="username">${username}</p>
    </div>
    `

    return div.firstElementChild;
}


//fetch function
const getAllUsers = () => {
  fetch('api/ranking_api.php')
    .then (response => response.json())
    .then (data => {
      states.users = data;
      console.log(states.users);
      render();
    })
    .catch(error => console.error("Fetch error:", error));
}

const render= () => {
    leaderboard.innerHTML = '';
    topThreeLeaderboard.innerHTML = '';
    co2.innerHTML = '';

    let totalCO2 = 0;
    states.users.forEach((user,index) => {

      totalCO2 += Number(user.saved_co2);
      const userCard = createUserCard(user,index+1);
      // Add a class for top 3
      if (index < 3) {
          userCard.classList.add('top-3');
          userCard.classList.add(`rank-${index+1}`);
      }
    
      leaderboard.appendChild(userCard);
  
    });

    co2.innerHTML = String(totalCO2);
}

getAllUsers();
