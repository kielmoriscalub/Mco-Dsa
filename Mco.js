// User login (non-GUI)
let user = prompt("Enter your name to login:");
if (!user) {
  alert("Login required!");
  throw "No user";
}

// Bus categories and buses
let categories = {
  Luxury: createBuses("Luxury Express", 1500, 4, 30),
  Aircon: createBuses("Aircon Bus", 600, 4, 30),
  Minibus: createBuses("Minibus", 400, 4, 20),
  UVExpress: createBuses("UV Express", 200, 4, 15)
};

// Reservation list
let reservations = [];

function createBuses(namePrefix, price, count, seats) {
  let buses = [];
  for (let i = 1; i <= count; i++) {
    buses.push({
      code: `${namePrefix} ${i}`,
      price: price,
      seats: Array(seats).fill(null) // null = available
    });
  }
  return buses;
}

// Menu loop
let running = true;
while (running) {
  let choice = prompt(`
  Welcome, ${user}!
  1. Reserve Seat
  2. Cancel Reservation
  3. Show Reserved Seats
  4. Pay
  5. Exit
  Choose an option:`);

  switch (choice) {
    case "1":
      reserveSeat();
      break;
    case "2":
      cancelReservation();
      break;
    case "3":
      showReservedSeats();
      break;
    case "4":
      pay();
      break;
    case "5":
      running = false;
      alert("Goodbye!");
      break;
    default:
      alert("Invalid choice.");
  }
}

function reserveSeat() {
  let cat = prompt("Choose Category:\nLuxury\nAircon\nMinibus\nUVExpress");
  let buses = categories[cat];
  if (!buses) return alert("Invalid category.");

  let busList = buses.map((b, i) => `${i + 1}. ${b.code}`).join("\n");
  let busIndex = parseInt(prompt(`Choose Bus:\n${busList}`)) - 1;
  if (busIndex < 0 || busIndex >= buses.length) return alert("Invalid bus.");

  let bus = buses[busIndex];
  let available = bus.seats.map((s, i) => (s ? null : i + 1)).filter(Boolean);

  if (available.length === 0) return alert("No available seats.");

  let seatNum = parseInt(prompt(`Available Seats: ${available.join(", ")}\nChoose seat number:`)) - 1;
  if (bus.seats[seatNum]) return alert("Seat already taken.");
  if (seatNum < 0 || seatNum >= bus.seats.length) return alert("Invalid seat.");

  bus.seats[seatNum] = user;
  reservations.push({ user, bus: bus.code, seat: seatNum + 1, price: bus.price });

  alert(`Seat Reserved!\nBus: ${bus.code}\nSeat: ${seatNum + 1}\nPrice: ₱${bus.price}`);
}

function cancelReservation() {
  let found = reservations.find(r => r.user === user);
  if (!found) return alert("No reservation found.");

  let bus = Object.values(categories).flat().find(b => b.code === found.bus);
  bus.seats[found.seat - 1] = null;
  reservations = reservations.filter(r => r !== found);

  alert(`Reservation cancelled for seat ${found.seat} on ${found.bus}.`);
}

function showReservedSeats() {
  let result = reservations.map(r =>
    `Name: ${r.user}\nBus: ${r.bus}\nSeat: ${r.seat}\nPrice: ₱${r.price}`
  ).join("\n\n");
  alert(result || "No reservations yet.");
}

function pay() {
  let total = reservations.filter(r => r.user === user).reduce((sum, r) => sum + r.price, 0);
  alert(`Total to pay: ₱${total}`);
}