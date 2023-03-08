<?php
session_start();

if(isset($_POST['submit_pass']) && $_POST['pass']) {
        $pass=$_POST['pass'];
        if($pass=="") {
                $_SESSION['password']=$pass;
        }
        else {
                $error="Incorrect Pssword";
        }
}

if(isset($_POST['page_logout'])) {
        unset($_SESSION['password']);
}

$user = "";
$password = "";
$database = "";
$servername = "";

$mysqli = new mysqli($servername, $user,
                $password, $database);
if ($mysqli->connect_error) {
        die('Connect Error (' .
        $mysqli->connect_errno . ') '.
        $mysqli->connect_error);
}

$sql = " SELECT * FROM punishments ORDER BY Id DESC ";
$result = $mysqli->query($sql);
$mysqli->close();

?>

<html>
<head>
</head>
<body>
<!-- <div id="wrapper"> -->

<?php
if($_SESSION['password']=="") {
        ?>
        <h1>Gronkiy Discord Bot Punishment Data</h1>
        <form method="post" action="" id="logout_form">
        <input type="submit" name="page_logout" value="LOGOUT">
        </form>

        <section>
                <table>
                <thead>
                        <tr>
                        <th>Id</th>
                        <th>Punishment Type</th>
                        <th>Helper Username</th>
                        <th>Helper Id</th>
                        <th>User Username</th>
                        <th>User Id</th>
                        <th>Duration</th>
                        <th>Reason</th>
                        <th>DateTime</th>
                        <th>Attachment</th>
                        </tr>
                </thead>
                <?php
                        while($rows=$result->fetch_assoc())
                        {
                ?>
                <tbody>
                        <tr>
                        <td><?php echo $rows['Id'];?></td>
                        <td><?php echo $rows['PunishmentType'];?></td>
                        <td><?php echo $rows['HelperUsername'];?></td>
                        <td><?php echo $rows['HelperId'];?></td>
                        <td><?php echo $rows['UserUsername'];?></td>
                        <td><?php echo $rows['UserId'];?></td>
                        <td><?php echo $rows['Duration'];?></td>
                        <td><?php echo $rows['Reason'];?></td>
                        <td><?php echo $rows['Datetime'];?></td>
                        <td><?php echo $rows['Attachment'];?></td>
                        </tr>
                </tbody>
                <?php
                        }
                ?>
                </table>
        </section>
        <?php
} 
else {
        ?>
        <div id="wrapper">
        <h1>Gronkiy Discord Bot Punishment Data</h1>
        <form method="post" action="" id="login_form">
        <h1>Login</h1>
        <input type="password" name="pass" placeholder="password">
        <input type="submit" name="submit_pass" value="Submit">
        </form>
        <?php	
}
?>

</div>
</body>
</html>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
body {
        margin: 0 auto;
        padding:0px;
        text-align: center;
        width:100%;
        font-family: 'Roboto', sans-serif;
        background-color: black;
}
h1 {
        margin-top:50px;
        font-size:45px;
        color:white;
}
#wrapper {
        margin:0 auto;
        padding:0px;
        text-align:center;
        width:995px;
}
#wrapper h1 {
        margin-top:50px;
        font-size:45px;
        color:white;
}
#wrapper p {
        font-size:16px;
}
#logout_form input[type="submit"] {
        width:250px;
        margin-top:10px;
        height:40px;
        font-size:16px;
        background:none;
        border:2px solid white;
        color:white;
}
#login_form {
        margin-top:200px;
        background-color:white;
        width:350px;
        margin-left:310px;
        padding:20px;
        box-sizing:border-box;
        box-shadow:0px 0px 10px 0px #3B240B;
}
#login_form h1 {
        margin:0px;
        font-size:25px;
        color: black;
}
#login_form input[type="password"] {
        width:250px;
        margin-top:10px;
        height:40px;
        padding-left:10px;
        font-size:16px;
}
#login_form input[type="submit"] {
        width:250px;
        margin-top:10px;
        height:40px;
        font-size:16px;
        background-color:#A5D3EB;
        border:none;
        color:white;
        border-radius:3px;
}
#login_form p {
        margin:0px;
        margin-top:15px;
        color:#8A4B08;
        font-size:17px;
        font-weight:bold;
}
table {
        margin: 0 auto;
        font-size: 16px;
}
td {
        background-color: #E2E2E2;
        border: 1px solid #E2E2E2;
        font-weight: lighter;
        right: 100px;
}
th,
td {
        font-weight: bold;
        border: 1px solid black;
        padding: 10px;
        text-align: center;
}
th {
        background-color: #A5D3EB;
}
</style>