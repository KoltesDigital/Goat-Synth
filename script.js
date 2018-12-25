var soundData = [
  {
    file: "cat/1.ogg",
    frequency: 1189
  },
  {
    file: "dog/1.ogg",
    frequency: 456
  },
  {
    file: "dog/2.ogg",
    frequency: 507
  },
  {
    file: "goat/1.ogg",
    frequency: 1668
  },
  {
    file: "goat/2.ogg",
    frequency: 1671
  }
];

var images = [
  "cat/1.jpg",
  "cat/2.jpg",
  "cat/3.jpg",
  "cat/4.jpg",
  "cat/5.jpg",
  "goat/1.jpg",
  "goat/2.jpg",
  "goat/3.jpg",
  "goat/4.png",
  "dog/1.jpg",
  "dog/2.jpg",
  "dog/3.jpg",
  "dog/4.jpg"
];

var runtimeRNG = new TetrisRNG(0.6);
soundData.forEach(function(data) {
  var player = new Tone.GrainPlayer(data.file).toMaster();

  runtimeRNG.add({
    data: data,
    player: player
  });
});

var runtimeByNotes = {};

var imageContainer = document.getElementById("Image");
var imageTimeoutId = null;
var imageTimeoutFunction = null;
var imageRNG = new TetrisRNG(0.6);
images.forEach(function(image) {
  imageRNG.add(image);

  var element = document.createElement("img");
  element.src = image;
});
imageRNG.shuffle();

var keyboard = new Interface.Keyboard();
keyboard.keyboard.rootNote = 60;
keyboard.keyboard.octaves = 2;

keyboard.keyDown = function(note) {
  do {
    var runtime = runtimeRNG.random();
  } while (runtime === runtimeByNotes[note]);
  runtimeByNotes[note] = runtime;
  runtime.playing = true;
  runtime.player.stop();
  runtime.player.detune =
    (Tone.Frequency(note).toMidi() -
      Tone.Frequency(runtime.data.frequency).toMidi()) *
    60;
  runtime.player.start();

  var image = document.createElement("img");
  image.src = imageRNG.random();
  imageContainer.appendChild(image);
  if (imageTimeoutId !== null) {
    clearTimeout(imageTimeoutId);
    imageTimeoutFunction();
  }

  imageTimeoutFunction = function() {
    image.remove();
  };
  imageTimeoutId = setTimeout(imageTimeoutFunction, 500);
};
