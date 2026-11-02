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


$(document).ready(function () {

  //  SETTINGS AND STATE 
  const icons = { phone: "📱", glasses: "👓", bag: "👜", cup: "☕", crumbs: "🍰" };
  const colors = ["red", "blue", "green", "black", "yellow", "purple"];
  const thingNames = ["phone", "glasses", "bag", "cup", "crumbs"];
  const thingWords = { phone: "a phone", glasses: "glasses", bag: "a bag", cup: "a cup", crumbs: "cake crumbs" };

  const $card = $("#guest-card");
  let openName = null;     // name of the guest whose card is open (null = none)
  let moving = false;      // true while a guest is flying
  let sorted = {};         // which rooms are sorted now, e.g. { hall: true }
  let posCounter = 1000;   // gives a new "end of the room" number to moved guests

  function allGuests() {
    return $(".guest").not(".flying");   // .flying is the temporary copy during a move
  }

  // BUILLDING PARTY
  function buildParty() {
    sorted = {};
    $("#floor-1, #floor-2").empty();

    party.forEach(function (room) {
      const $room = $("<div></div>")
        .addClass("room")
        .attr("id", room.id)
        .attr("data-floor", room.floor);
      const $guests = $("<div></div>").addClass("guests");
      const $sortBtn = $("<button></button>")
        .addClass("sort-btn")
        .attr("data-room", room.id)
        .text("Sort by time");

      $room.append($sortBtn)
        .append("<h3 class='room-name'>" + room.name + "</h3>")
        .append($guests);
      $("#floor-" + room.floor).append($room);

      room.guests.forEach(function (g, i) {
        const $guest = $("<div></div>")
          .addClass("guest " + g.color)
          .attr("data-name", g.name)
          .attr("data-time", g.time)
          .attr("data-pos", i);                 // place in the picture (for sorting back)

        if (g.aitu) $guest.addClass("aitu");
        g.things.forEach(function (t) { $guest.addClass("has-" + t); });

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

  //  RESULT (from Task 1)
  function showResult($found) {
    $found.addClass("found");
    $found.animate({ top: -15 }, 150).animate({ top: 0 }, 150);
    const names = $found.map(function () { return $(this).data("name"); }).get().join(", ");
    $("#result").text($found.length + " found: " + names);
  }

  function showRooms($rooms) {
    $rooms.addClass("found-room");
    const names = $rooms.find(".room-name").map(function () { return $(this).text(); }).get().join(", ");
    $("#result").text($rooms.length + " found: " + names);
  }

  //-------------------------------- CASE BUTTONS + SPOTLIGHT 
  $("#buttons button[data-case]").on("click", function () {
    const c = $(this).data("case");
    hideCardNow();
    buildParty();
    let $found = $();

    if (c === 1) {
      $found = $("#hall .guest");
    } else if (c === 2) {
      $found = $(".guest.yellow, .guest.purple");
    } else if (c === 3) {
      $found = $("[data-floor=2] .guest.aitu");
    } else if (c === 4) {
      $found = $(".guest.has-glasses, .guest.has-bag");
    } else if (c === 5) {
      $found = $(".guest:not(.has-phone):not(.has-glasses):not(.has-bag):not(.has-cup):not(.has-crumbs)");
    } else if (c === 6) {
      $found = $(".guest.has-phone:not(.has-bag)");
    } else if (c === 7) {
      $found = $(".guest").filter(function () {
        return $(this).data("time") >= "20:30" && $(this).data("time") <= "21:00";
      });
    } else if (c === 8) {
      $found = $(".guest:not(.aitu)").filter(function () {
        return $(this).data("time") > "21:00";
      });
    } else if (c === 9) {
      $found = $("[data-name=Askar]").prev().add($("[data-name=Askar]").next());
    } else if (c === 10) {
      $found = $(".guest:last-child");
    } else if (c === 11) {
      $found = $(".guest:nth-child(3)");
    } else if (c === 12) {
      $found = $("[data-name=Timur]").nextAll();
    } else if (c === 13) {
      $found = $(".guest.black").prev();
    } else if (c === 14) {
      $found = $("[data-name=Aruzhan]").closest(".room");
    } else if (c === 15) {
      $found = $(".room").filter(function () {
        return $(this).find(".guest").length < 6;
      });
    } else if (c === 16) {
      $found = $(".room:has(.has-cup):not(:has(.has-glasses))");
    } else if (c === 17) {
      $found = $(".guest:first-child");
    } else if (c === 18) {
      const $miras = $("<div></div>")
        .addClass("guest blue aitu has-phone")
        .attr("data-name", "Miras")
        .attr("data-time", "21:20")
        .attr("data-pos", 3.5)                    // between Askar (3) and Inkar (4)
        .append("<img class='avatar' src='https://api.dicebear.com/9.x/open-peeps/svg?seed=Miras'>")
        .append("<span class='badge'>🎓</span>")
        .append("<div class='name'>Miras</div>")
        .append("<div class='time'>21:20</div>")
        .append("<div class='things'><span class='thing'>" + icons.phone + "</span></div>")
        .hide()
        .insertAfter($("[data-name=Askar]"));
      $miras.fadeIn(800);
      $found = $miras;
    } else if (c === 19) {
      $found = $("[data-name=Natasha]");
      $found.fadeOut(800, function () { $(this).remove(); });
    } else if (c === 20) {
      $found = $("[data-floor=1] .guest.has-crumbs:not(.has-cup)")
        .filter(function () {
          const t = $(this).data("time");
          return t > "21:00" && t < "21:30";
        })
        .filter(function () {
          return $(this).prev().add($(this).next()).filter(".aitu").length > 0;
        });
    }

    // show the result and decide who stays bright
    let $bright;
    if (c === 14 || c === 15 || c === 16) {
      showRooms($found);
      $bright = $found.find(".guest");      // the guests inside the found rooms
    } else {
      showResult($found);
      $bright = $found;
    }
    allGuests().not($bright).fadeTo(300, 0.2);    // everybody else becomes pale
  });

  $("#clear-btn").on("click", function () {
    allGuests().stop(true, true).fadeTo(300, 1);
    $(".found").removeClass("found");
    $(".found-room").removeClass("found-room");
    $("#result").text("Click a case button");
  });

  // ------------------------------------- GUEST CARD 
  function thingsText(things) {
    if (things.length === 0) return "Came with nothing";
    const words = things.map(function (t) { return thingWords[t]; });
    if (words.length === 1) return "Has " + words[0];
    return "Has " + words.slice(0, -1).join(", ") + " and " + words[words.length - 1];
  }

  function fillCard($guest) {
    const color = colors.filter(function (c) { return $guest.hasClass(c); })[0];
    const things = thingNames.filter(function (t) { return $guest.hasClass("has-" + t); });
    const currentId = $guest.closest(".room").attr("id");

    $("#card-name").text($guest.data("name"));
    $("#card-info").empty();  // clear so that previous info disapeaer
    [
      "Wears " + color,
      "Came at " + $guest.data("time"),
      $guest.hasClass("aitu") ? "AITU student" : "Not an AITU student",
      thingsText(things),
      "Room: " + $guest.closest(".room").find(".room-name").text()
    ].forEach(function (line) {
      $("#card-info").append($("<li></li>").text(line));
    });

    // one button for every OTHER room
    $("#card-moves").empty();  // delete the old
    party.forEach(function (room) {  // create new one
      if (room.id !== currentId) {
        $("#card-moves").append(
          $("<button></button>")
            .attr("data-room", room.id)
            .text("Move to the " + room.name.toLowerCase())
        );
      }
    });
  }

  function hideCardNow() {            // closes without animation
    $card.stop(true).hide();
    openName = null;
  }

  function openCard($guest) {
    hideCardNow();                    // only one card can be open
    fillCard($guest);
    openName = $guest.data("name");

    const $av = $guest.find(".avatar");
    const from = $av.offset();
    const size = $av.outerWidth();

    // measure the full size of the card (invisible for a moment)
    $card.css({ display: "block", visibility: "hidden", width: 230, height: "auto", padding: 12, top: 0, left: 0 });
    const fullW = $card.width();
    const fullH = $card.height();
    const boxW = $card.outerWidth();

    // final place: centered on the avatar, but inside the window
    let left = from.left + size / 2 - boxW / 2;
    left = Math.max(10, Math.min(left, $(window).width() - boxW - 10));
    const top = Math.max(10, from.top - 10);

    // start as small as the avatar, then grow
    $card.css({ visibility: "visible", top: from.top, left: from.left, width: size, height: size, padding: 0 })
      .animate({ top: top, left: left, width: fullW, height: fullH, padding: 12 }, 300);
  }

  function closeCard() {              // closes with animation, back into the photo
    if (openName === null) return;
    const $guest = $(".guest[data-name=" + openName + "]").not(".flying");
    openName = null;
    if ($guest.length === 0) {
      $card.stop(true).hide();
      return;
    }
    const $av = $guest.first().find(".avatar");
    const to = $av.offset();
    $card.stop(true).animate(
      { top: to.top, left: to.left, width: $av.outerWidth(), height: $av.outerHeight(), padding: 0 },
      250,
      function () { $(this).hide(); }
    );
  }

  $("#house").on("click", ".guest", function () {
    if (moving) return;
    if ($(this).data("name") === openName) {
      closeCard();
    } else {
      openCard($(this));
    }
  });

  $(document).on("click", function (e) {            // click outside
    if ($(e.target).closest("#guest-card, .guest").length === 0) closeCard();
  });

  $(document).on("keydown", function (e) {          // Esc
    if (e.key === "Escape") closeCard();
  });

  // ================= MOVE (2.3) =================
  function moveInArray(name, toId) {
    let guestObj = null;
    party.forEach(function (room) {
      const i = room.guests.findIndex(function (g) { return g.name === name; });
      if (i > -1) guestObj = room.guests.splice(i, 1)[0];   // take out of the old room
    });
    if (guestObj === null) return;                          // (Miras is not in the array)
    party.forEach(function (room) {
      if (room.id === toId) room.guests.push(guestObj);     // put at the end of the new room
    });
  }

  function moveGuest(name, toId) {
    moving = true;
    hideCardNow();

    const $old = $(".guest[data-name=" + name + "]");
    const fromId = $old.closest(".room").attr("id");
    moveInArray(name, toId);                
    sorted[fromId] = false;
    sorted[toId] = false;

    const fullW = $old.width();
    const pad = parseFloat($old.css("paddingLeft"));
    const gap = 6;                           // the gap between cards (from the CSS)
    const start = $old.offset();

    // two copies: one flies, one will stay in the new room
    const $fly = $old.clone().addClass("flying").css({ top: start.top, left: start.left });
    const $new = $old.clone().attr("data-pos", posCounter++).css({ visibility: "hidden", overflow: "hidden" });
    $("#" + toId + " .guests").append($new);

    // find where the new card will really stand when everything is finished
    $old.hide();
    const end = $new.offset();
    $old.show();

    // new place starts closed
    $new.css({ width: 0, paddingLeft: 0, paddingRight: 0, marginLeft: -gap });

    // 1. old place closes slowly
    $old.css({ visibility: "hidden", overflow: "hidden" })
      .animate({ width: 0, paddingLeft: 0, paddingRight: 0, marginLeft: -gap }, 700);
    // 2. new place opens slowly
    $new.animate({ width: fullW, paddingLeft: pad, paddingRight: pad, marginLeft: 0 }, 700);
    // 3. the card flies
    $("body").append($fly);
    $fly.animate({ top: end.top, left: end.left }, 800, function () {
      $old.remove();
      $fly.remove();
      $new.css({ visibility: "", overflow: "", width: "", paddingLeft: "", paddingRight: "", marginLeft: "" });
      moving = false;
    });
  }

  $("#card-moves").on("click", "button", function () {
    if (moving) return;
    moveGuest(openName, $(this).data("room"));
  });

  // ================= SORT BY TIME (2.4) =================
  $("#house").on("click", ".sort-btn", function () {
    if (moving) return;
    const roomId = $(this).data("room");
    const $guests = $("#" + roomId + " .guests");
    const $items = $guests.children(".guest");

    sorted[roomId] = !sorted[roomId];                        // click again = go back
    const key = sorted[roomId] ? "data-time" : "data-pos";

    // 1. remember where every card is RIGHT NOW (even in the middle of a slide)
    $items.stop("sort", true);
    $items.each(function () { $(this).data("old", $(this).offset()); });
    $items.css({ left: 0, top: 0 });

    // 2. put the cards in the new order (the page jumps, but nobody sees it yet)
    const list = $items.get().sort(function (a, b) {
      const x = key === "data-time" ? $(a).attr(key) : parseFloat($(a).attr(key));
      const y = key === "data-time" ? $(b).attr(key) : parseFloat($(b).attr(key));
      return x < y ? -1 : 1;
    });
    $guests.append(list);

    // 3. push every card back to its old place, then slide it to 0
    $items.each(function () {
      const old = $(this).data("old");
      const now = $(this).offset();
      $(this)
        .css({ left: old.left - now.left, top: old.top - now.top })
        .animate({ left: 0, top: 0 }, { duration: 600, queue: "sort" })
        .dequeue("sort");
    });
  });

  buildParty();
});