# HCTF 2016 changelog-story
include : index.php login.php register.php README.md config.php

tag:条件竞争

index.php:
```php
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
```

register.php:

```php
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
```


config.php:
```php
<?php
define('MYSQL_HOST', 'localhost');
define('MYSQL_USER', 'root');
define('MYSQL_PASSWORD', 'root');
define('MYSQL_DATABASE', 'HCTF');

error_reporting(0);
ini_set('display_errors', 'Off');
ini_set('allow_url_fopen', 'Off');
session_start();
```


README.md:

```markdown
# 跑得比谁都快

## ChangeLog 的故事
## 这里是加了.git之后忘删的README.md  XD by Aklis

## ChangeLog

- 2016.11.11
完成登陆功能，登陆之后在session将用户名和用户等级放到会话信息里面。
判断sessioin['level']是否能在index.php查看管理员才能看到的**东西**。
XD

- 2016.11.10
老板说注册成功的用户不能是管理员，我再写多一句把权限降为普通用户好啰。

- 2016.10 
我把注册功能写好了
```