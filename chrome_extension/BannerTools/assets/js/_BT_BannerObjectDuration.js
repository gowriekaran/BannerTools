document.getElementById("_BT_adDurationLabel").innerHTML = (banner.myTL.duration() + "s");
if (banner.myTL.duration() > 30) {
    document.getElementById("_BT_adDurationLabel").style.color = "rgb(255,59,48)";
}