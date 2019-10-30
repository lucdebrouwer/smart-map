function displayImage(lijn){
  var img = document.getElementById('busImg');
  img.style.display = 'block';

  switch(lijn){
    case 400:
      img.src = "../img/400.png";
      break;
    case 401:
      img.src = "../img/401.png";
      break;
    case 402:
      img.src = "../img/402.png";
      break;
    case 403:
      img.src = "../img/403.png";
      break;
    case 404:
      img.src = "../img/404.png";
      break;
    case 405:
      img.src = "../img/405.png";
      break;
    case 406:
      img.src = "../img/406.png";
      break;
    case 407:
      img.src = "../img/407.png";
      break;

  }
}
