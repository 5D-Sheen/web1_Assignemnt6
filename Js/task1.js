const party = [
  {
    id: "balcony", name: "Balcony", floor: 2,
    guests: [
      { name: "Aigerim", color: "green",  time: "20:45", aitu: true,  things: ["cup", "crumbs"] },
      { name: "Aliya",   color: "black",  time: "21:15", aitu: false, things: ["phone", "cup"] },
      { name: "Madina",  color: "green",  time: "22:10", aitu: false, things: ["phone", "bag", "crumbs"] },
      { name: "Ivan",    color: "black",  time: "20:10", aitu: true,  things: ["cup"] }
    ]
  },
  {
    id: "hall", name: "Hall", floor: 2,
    guests: [
      { name: "Arman",   color: "yellow", time: "20:35", aitu: true,  things: ["bag", "glasses"] },
      { name: "Sophia",  color: "purple", time: "21:20", aitu: true,  things: ["phone"] },
      { name: "Dias",    color: "green",  time: "19:45", aitu: true,  things: [] },
      { name: "Bekzat",  color: "purple", time: "20:55", aitu: false, things: ["bag", "cup", "crumbs"] },
      { name: "Aruzhan", color: "black",  time: "21:50", aitu: true,  things: ["phone"] },
      { name: "Saule",   color: "green",  time: "21:25", aitu: false, things: ["glasses"] }
    ]
  },
  {
    id: "kitchen", name: "Kitchen", floor: 1,
    guests: [
      { name: "Nurlan",  color: "red",    time: "19:40", aitu: true,  things: ["phone", "cup"] },
      { name: "Emma",    color: "black",  time: "20:15", aitu: false, things: ["bag"] },
      { name: "Timur",   color: "green",  time: "21:05", aitu: true,  things: ["phone", "bag", "crumbs"] },
      { name: "Sergey",  color: "yellow", time: "20:50", aitu: false, things: [] },
      { name: "Yerlan",  color: "red",    time: "21:40", aitu: true,  things: ["glasses", "phone"] },
      { name: "Kamila",  color: "black",  time: "20:05", aitu: false, things: ["cup"] }
    ]
  },
  {
    id: "living", name: "Living room", floor: 1,
    guests: [
      { name: "Daniel",  color: "blue",   time: "19:55", aitu: true,  things: ["glasses"] },
      { name: "Zarina",  color: "green",  time: "21:10", aitu: false, things: ["bag", "phone", "crumbs"] },
      { name: "Natasha", color: "yellow", time: "20:30", aitu: true,  things: [] },
      { name: "Askar",   color: "black",  time: "21:00", aitu: true,  things: ["phone"] },
      { name: "Inkar",   color: "purple", time: "20:20", aitu: false, things: ["bag"] }
    ]
  }
];

const icons = { phone: "📱", glasses: "👓", bag: "👜", cup: "☕", crumbs: "🍰" };

function buildParty() {
  $("#floor-1, #floor-2").empty();          // clear first, so rebuild any time

  party.forEach(function (room) {

    // 1. the room
    const $room = $("<div></div>")
      .addClass("room")
      .attr("id", room.id)
      .attr("data-floor", room.floor);
    const $guests = $("<div></div>").addClass("guests");
    $room.append("<h3 class='room-name'>" + room.name + "</h3>").append($guests);
    $("#floor-" + room.floor).append($room); // ex. #floor-2 

    // 2. the guests of this room
    room.guests.forEach(function (g) {
      const $guest = $("<div></div>")
        .addClass("guest " + g.color)       // color as a class
        .attr("data-name", g.name)
        .attr("data-time", g.time);

      if (g.aitu) $guest.addClass("aitu");  // AITU as a class

      g.things.forEach(function (t) {
        $guest.addClass("has-" + t);        // things as classes: has-phone, has-bag...
      });

      $guest.append("<img class='avatar' src='https://api.dicebear.com/9.x/open-peeps/svg?seed=" + g.name + "66'>");
      $guest.append("<span class='badge'>🎓</span>");
      $guest.append("<div class='name'>" + g.name + "</div>");
      $guest.append("<div class='time'>" + g.time + "</div>");

      const $things = $("<div></div>").addClass("things");
      g.things.forEach(function (t) {
        $things.append("<span class='thing'>" + icons[t] + "</span>");
      });
      $guest.append($things);

      $guests.append($guest);
    });
  });
}

function showResult($found) {
  $found.addClass("found");                
  $found.animate({ top: -15 }, 150)    // jump once
        .animate({ top: 0 }, 150);

  const names = $found.map(function () {             // collect the names
    return $(this).data("name");
  }).get().join(", "); // get truns JQuery to js array, join (for array) turns it to string with ,

  $("#result").text($found.length + " found: " + names);
}

function showRooms($rooms) {
  $rooms.addClass("found-room");                      
  const names = $rooms.find(".room-name").map(function () {
    return $(this).text();    // text of the <h3>, like "Hall"
  }).get().join(", ");
  $("#result").text($rooms.length + " found: " + names);
}


$(document).ready(function () {

    buildParty();

    $("#buttons button").on("click", function () {
    const c = $(this).data("case");                  // reads data-case
    buildParty();                                    // rebuild the page before every case
    let $found = $();   // empty jQuery set

    if (c === 1) {
      $found = $("#hall .guest");                   
    }
    else if (c === 2) {
       $found =$(".guest.yellow, .guest.purple"); 
    }
    else if (c === 3) {
        $found = $("[data-floor=2] .guest.aitu");
    }
    else if (c === 4) {
        $found = $(".guest.has-glasses, .guest.has-bag");
    }
    else if (c === 5) {
        $found = $(".guest:not(.has-phone):not(.has-glasses):not(.has-bag):not(.has-cup):not(.has-crumbs)");
    }
    else if (c === 6) {
        $found = $(".guest.has-phone:not(.has-bag)");
    }
    else if (c === 7) {
        $found = $(".guest").filter(function () {
            return $(this).data("time") >= "20:30" && $(this).data("time") <="21:00"; 
        });
    }
    else if (c === 8) {
        $found = $(".guest:not(.aitu)").filter(function () {
            return $(this).data("time") > "21:00";
        });
    }
    else if (c === 9) {
        $found = $("[data-name=Askar]").prev().add($("[data-name=Askar]").next());
    }
    else if (c === 10) {
        $found = $(".guest:last-child");
    }
    else if (c === 11) {
        $found = $(".guest:nth-child(3)");
    }
    else if (c === 12) {
        $found = $("[data-name=Timur]").nextAll();
    }
    else if (c === 13) {
        $found = $(".guest.black").prev();
    }
    else if (c === 14) {
        $found = $(".room [data-name=Aruzhan]").closest(".room");
    }
    else if (c === 15) {
       $found = $(".room").filter(function () {
        return $(this).find(".guest").length < 6;
       });
    }
    else if (c === 16) {
         $found = $(".room:has(.has-cup):not(:has(.has-glasses))");
    }
    else if (c === 17) {
        $found = $(".guest:first-child");
    }
    else if (c === 18) {
        const $miras = $("<div></div>")
          .addClass("guest blue aitu has-phone")
          .attr("data-name", "Miras")
          .attr("data-time", "21:20")
          .append("<img class='avatar' src='https://api.dicebear.com/9.x/open-peeps/svg?seed=Miras'>")
          .append("<span class='badge'>🎓</span>")
          .append("<div class='name'>Miras</div>")
          .append("<div class='time'>21:20</div>")
          .append("<div class='things'><span class='thing'>" + icons["phone"] + "</span></div>");
        
        $miras.hide(); // invisible at first
        $miras.insertAfter($("[data-name=Askar]")); // between askar and inkar

        $miras.fadeIn(800);
        $found = $miras;   
    }
    else if (c === 19) {
        $found = $("[data-name=Natasha]");
        $found.fadeOut(800, function () {
        $(this).remove();
  });
    }
    else if (c === 20) {
       $found = $("[data-floor=1] .guest.has-crumbs:not(.has-cup)")
        .filter(function () {
          const t = $(this).data("time");
          return t > "21:00" && t < "21:30";
        })
        .filter(function () {
          return $(this).prev().add($(this).next()).filter(".aitu").length > 0;
        });
    }
    

   if (c === 14 || c === 15 || c === 16) {
        showRooms($found);
    } else {
        showResult($found);
    }
  });


});