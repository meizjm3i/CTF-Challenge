<?php
/*
 Author: Aklis
*/
session_start();
if (!isset($_SESSION['username'])) {
  header("Location: ./login.php");
  exit();
}

if ($_SESSION['level']==='0') {
  echo "You level is zero, so you can't touch me!";
  exit();
}

echo "Hello, " . $_SESSION['username'];

echo "This is your flag: hctf{}";
```


login.php:
```php
<?php
include("config.php");

if (isset($_SESSION['username'])) {
  header("Location: ./index.php");
  exit();
}

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

  $query = "select * from users where username='$username' and password='$password'";

  $result = $mysqli->query($query);
  
  if ($result) {
    $row = $result->fetch_array();
    $_SESSION['id'] = $row['id'];
    $_SESSION['username'] = $row['username'];
    $query = "select * from role where uid = $_SESSION[id]";
    $res = $mysqli->query($query);
    $row = $res ? $res->fetch_array() : array();
    $_SESSION['level'] = $row['level'];

    header("Location: ./index.php");
  } else {
    exit("用户名或密码错误？？？ (一脸千岁");
  }

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
      <legend>Login | <a href="./register.php">Register</a></legend>
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
