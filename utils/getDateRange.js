function getDateRange(rangeType, specificDate = null) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // JavaScript months are 0-based
  const day = today.getDate();

  let startDate, endDate;

  if (specificDate) {
    const selectedDate = new Date(specificDate);
    if (isNaN(selectedDate)) {
      throw new Error("Invalid specificDate format.");
    }

    // 将日期转换为 UTC 时间
    startDate = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    endDate = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
  } else {
    switch (rangeType) {
      case "week":
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay()); // 本周第一天
        startDate = new Date(
          Date.UTC(
            firstDayOfWeek.getUTCFullYear(),
            firstDayOfWeek.getUTCMonth(),
            firstDayOfWeek.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );

        const lastDayOfWeek = new Date(today);
        lastDayOfWeek.setDate(today.getDate() + 6 - today.getDay()); // 本周最后一天
        endDate = new Date(
          Date.UTC(
            lastDayOfWeek.getUTCFullYear(),
            lastDayOfWeek.getUTCMonth(),
            lastDayOfWeek.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );
        break;

      case "month":
        startDate = new Date(Date.UTC(year, month, 1)); // 本月第一天
        endDate = new Date(Date.UTC(year, month + 1, 0)); // 本月最后一天
        endDate.setHours(23, 59, 59, 999); // 设置最后一天的结束时间
        break;

      case "year":
        startDate = new Date(Date.UTC(year, 0, 1)); // 本年第一天
        endDate = new Date(Date.UTC(year, 11, 31)); // 本年最后一天
        endDate.setHours(23, 59, 59, 999); // 设置最后一天的结束时间
        break;

      case "day":
      default:
        startDate = new Date(
          Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            0,
            0,
            0,
            0
          )
        ); // 今天的开始时间
        endDate = new Date(
          Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            23,
            59,
            59,
            999
          )
        ); // 今天的结束时间
        break;
    }
  }

  return { startDate, endDate };
}

export default getDateRange;
