<?php
include('config.php');

if (isset($_POST['username']) && isset($_POST['password'])) {
  if ($_POST['username']==='' || $_POST['password']==='' || $_POST['gogogo']!=='苟!')
  {
    exit("搞事搞事搞事.jpg");
  }
  $mysqli = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);
  
  if ($mysqli->connect_errno) {
    exit("噗".$mysqli->error);
  }

  $username = $mysqli->escape_string($_POST['username']);
  $password = sha1($_POST['password']);

  if($result = $mysqli->query("select * from users where username='$username'")) {
    if ($result->num_rows) {
      $result->close();
      exit("用户已存在");
    }
  }

  $query = "insert into users (id, username, password) values (NULL , '$username', '$password')";
  if ($mysqli->query($query) !== TRUE) {
    exit('注册失败, 去打运维。'.$mysqli->error);
  }

  $query = "select * from users where username = '$username'";
  $result = $mysqli->query($query);
  if ($result) {
    $row = $result->fetch_array();
    $uid = $row['id'];
    $query = "insert into role (id, uid, level) values (NULL, $uid, 0)";
    if ($mysqli->query($query) === TRUE) {
      exit("El psy congroo ^_^");
    }
  } 
  exit ("Oh! No!");

}

?>

<!DOCTYPE html>
<html>
  <head>
    <title>PLAYGROUND - HCTF</title>
    <meta charset="UTF-8">
 
  </head>
  <body>
    <form action="" method="POST">
      <legend><a href="./login.php">Login</a> | Register</legend>
      <div>
        <input type="text" placeholder="Username" name="username">
      </div>
      <div>
        <input type="password" placeholder="Password" name="password">
      </div>
      <input type="submit" name="gogogo" value="苟!" ></button>
    </form>
  </body>
</html>
