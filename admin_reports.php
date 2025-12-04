<?php
    include("./header.html");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/report.css">
</head>
<body>
    <div class="reports-nav">
        <!-- <ul> -->
        <button data-filter="all">All</button>
        <button data-filter="pending">Pending</button>
        <button data-filter="resolved">Resolved</button>
        <button data-filter="banned">Banned</button>
        <!-- </ul> -->
    </div> 
    <section id="rep-pending" class="section">
        <!-- <h2 class="section-title">Pending Reports</h2> -->
        <div class="user-grid">
            <div class="user-card">
                <div class="user">
                    <div class="pfp"><img class="card-pfp-img" src="./images/stableRonaldo.avif"></div>
                    <div class="username">
                        <h3>James Taylor</h3>
                        <p>james@gmail.com</p>
                    </div>
                    <p class="arrow">➔</p>
                    <div class="pfp"><img class="card-pfp-img" src="./images/stableRonaldo.avif"></div>
                    <div class="username">
                        <h3>James Taylor</h3>
                        <p>james@gmail.com</p>
                    </div>
                    <div class="status"><p>Pending</p> </div>
                </div>
                <div class="report">
                    <h3>Reason of report</h3>
                    <p>blablablabalblablablalSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS</p>
                </div>
                <div class="options">
                    <div class="button"><button id="approve">Approve</button></div>
                    <div class="button"><button id="reject">Reject</button></div>
                </div>
            </div>
        </div>
    </section>
    <script src="scripts/report.js"></script>
</body>
</html>