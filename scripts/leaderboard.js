const users = [
  {username : 'Hi im number one',
    role : 'Driver',
    savedCO2 : '421.6'
  },
  {username : 'Jessie Chin',
    role : 'Driver',
    savedCO2 : '301.6'
  },
  {username : 'GAY',
    role : 'Passenger',
    savedCO2 : '281.6'
  },
  {username : 'no.4 doesnt deserve border',
    role : 'Driver',
    savedCO2 : '421.6'
  },
  {username : 'NOOB',
    role : 'Driver',
    savedCO2 : '421.6'
  }
];

const leaderboard = document.getElementById('leaderboard');
const topThreeLeaderboard = document.getElementById('top3Leaderboard')
console.log(leaderboard.innerHTML);

const createUserCard = ({username, role, savedCO2},ranking) => {
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
      <p class="stats">${savedCO2}</p>
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

const render= () => {
    leaderboard.innerHTML = '';
    topThreeLeaderboard.innerHTML = '';
  
    users.forEach((user,index) => {
    
    const userCard = createUserCard(user,index+1);
    // Add a class for top 3
    if (index < 3) {
        userCard.classList.add('top-3');
        userCard.classList.add(`rank-${index+1}`);
  
        const topThreeCard = createTopThreeCard(user);
        console.log(`rank-${index+1}`)
        topThreeCard.classList.add(`rank-${index+1}`)
        topThreeLeaderboard.appendChild(topThreeCard);
    }
  
    leaderboard.appendChild(userCard);
  
  });
}


render();
