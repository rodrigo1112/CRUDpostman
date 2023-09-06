const tallas = ["S", "M", "L", "XL"];

function getRandomSize() {
  const randomIndex = Math.floor(Math.random() * tallas.length);
  return tallas[randomIndex];
}

const randomSize = getRandomSize();
pm.environment.set("randomSize", randomSize);
