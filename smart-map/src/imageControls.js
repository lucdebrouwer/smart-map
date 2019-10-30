function displayImage(lijn){
  var img = document.getElementById('busImg');
  var titleText = document.getElementById('lijnNummer');
  img.style.display = 'block';

  switch(lijn){
    case 400:
      img.src = "../img/400.png";
      titleText.innerHTML = "Lijn <b>400</b>";
      break;
    case 401:
      img.src = "../img/401.png";
      titleText.innerHTML = "Lijn <b>401</b>";
      break;
    case 402:
      img.src = "../img/402.png";
      titleText.innerHTML = "Lijn <b>402</b>";
      break;
    case 403:
      img.src = "../img/403.png";
      titleText.innerHTML = "Lijn <b>403</b>";
      break;
    case 404:
      img.src = "../img/404.png";
      titleText.innerHTML = "Lijn <b>404</b>";
      break;
    case 405:
      img.src = "../img/405.png";
      titleText.innerHTML = "Lijn <b>405</b>";
      break;
    case 406:
      img.src = "../img/406.png";
      titleText.innerHTML = "Lijn <b>406</b>";
      break;
    case 407:
      img.src = "../img/407.png";
      titleText.innerHTML = "Lijn <b>407</b>";
      break;

  }
}
