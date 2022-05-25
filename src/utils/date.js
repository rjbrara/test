const convertSecondToDate = sec => {
  if (!sec) return;
  const convertNumber = parseInt(sec);
  const convertDate = new Date(convertNumber * 1000).toDateString();
  const newDate = convertDate.split(' ');
  return `${newDate[2]} ${newDate[1]} ${newDate[3]}`; // 1 Feb 2022
};

export default convertSecondToDate