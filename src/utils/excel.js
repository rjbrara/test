const namingExcel = (name) => {
  return `${Date.now()}-${name}.xls`;
};

export default namingExcel