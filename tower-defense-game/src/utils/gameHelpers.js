export const calculateDistance = (pos1, pos2) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const normalizeVector = (vector) => {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (magnitude === 0) return { x: 0, y: 0 };
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude
  };
};

export const isInRange = (pos1, pos2, range) => {
  return calculateDistance(pos1, pos2) <= range;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

export const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const formatNumber = (num) => {
  return num.toLocaleString();
};

export const getPercentage = (current, max) => {
  return Math.max(0, Math.min(100, (current / max) * 100));
};