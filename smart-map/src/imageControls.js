function displayImage(lijn){
  var img = document.getElementById('busImg');
  var titleText = document.getElementById('lijnNummer');
  var desc = document.getElementById('desc');
  img.style.display = 'block';

  switch(lijn){
    case 400:
      img.src = "../img/400.png";
      titleText.innerHTML = "Lijn <b>400</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station, WoensXL / ZH Catharina, BIC, Airport"
      break;
    case 401:
      img.src = "../img/401.png";
      titleText.innerHTML = "Lijn <b>401</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station Ns, Piazza, Philips Stadion, Glaspoort, Strijp-S, Cederlaan, Evoluon, Bredalaan, Hurksestraat, P&R Meerhoven, Landforum, Grasrijk, Meerrijk, Zandrijk, Cargo forum, Flight forum, Airport"
      break;
    case 402:
      img.src = "../img/402.png";
      titleText.innerHTML = "Lijn <b>402</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station, Piazza, Philips Stadion, Glaspoort, Strijp-S, Cederlaan, Evoluon, Noord Brabantlaan, Hurksestraat, P&R Meerhoven, Landforum, Polders, Smelen, Heemweg Centrum, City Centrum, Bossebaan, Mira, Kometenlaan, Sondervick, De Naaldenmaker, De Klokkenmaker"
      break;
    case 403:
      img.src = "../img/403.png";
      titleText.innerHTML = "Lijn <b>403</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station, Piazza, Philips Stadion, Glaspoort, Strijp-S, Cederlaan, Evoluon, Bredalaan, de Hurk, P&R Meerhoven, Landforum, Houtwal, Strijpsebaan, Hertgang, de Dom / Bovenhei, de Dom / Berg, Platanenlaan, Sint Janstraat, Zittardsestraat"
      break;
    case 404:
      img.src = "../img/404.png";
      titleText.innerHTML = "Lijn <b>404</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station, Gildelaan, Fontys Rachelsmolen, Europalaan, Generaal Pattonlaan, WoensXL / ZH Catharina, Churchilllaan, Mercuriuslaan, Summa College Sterrenlaan, Eckartdal, Nuenen West, Geldropsedijk, Kerkstraat, Nuenen Centrum"
      break;
    case 405:
      img.src = "../img/405.png";
      titleText.innerHTML = "Lijn <b>405</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station, Gildelaan, Fontys Rachelsmolen, Europalaan, Generaal Pattonlaan, WoensXL / ZH Catharina, Gerretsonlaan, Roelantlaan, Sportpark Eindhoven Noord, Autowijk, Artoislaan, Nicehof, Cahorslaan, Spaaihoefweg, De Hoeve, Rijssellaan, Herautlaan, De Wiek"
      break;
    case 406:
      img.src = "../img/406.png";
      titleText.innerHTML = "Lijn <b>406</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station, Gildelaan, Fontys Rachelsmolen, Europalaan, Generaal Pattonlaan, WoensXL / ZH Catharina, Gerretsonlaan, Roelantlaan, Sportpark Eindhoven Noord, Autowijk, Roubaixlaan, Castilielaan, Science Park West / 5700, Science Park Oost / 5100, Meubelplein"
      break;
    case 407:
      img.src = "../img/407.png";
      titleText.innerHTML = "Lijn <b>407</b>";
      desc.innerHTML = "Deze bus komt langs de volgende haltes: \n Station, 18 Septemberplein, Smalle Haven, PC Hooftlaan, Parktheater, Looiakkerstraat, Boutenslaan, Kortonjo, Zwemcentrum Tongelreep, Genneper Parken, Locatillistraat / Pr. Holstlaan, HTC The Strip, HTC Heide, HTC Vijver, HTC Dommeldal, HTC Berkenbos, Stadhuisplein, Vrijstraat, Piazza"
      break;

  }
}
