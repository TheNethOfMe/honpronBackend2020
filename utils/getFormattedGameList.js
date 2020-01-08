const getFormattedGameList = (list, episode) => {
  return list
    .split(",")
    .map(game => game.split("@"))
    .filter(game => parseInt(game[1]) <= episode)
    .map(game => game[0]);
};

module.exports = getFormattedGameList;
