import React, { useEffect, useMemo, useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  tablemainbox: {
    "& .activitysub": {
      padding: "20px",
      borderBottom: "1px solid #3A3939",
      "& svg": {
        fontSize: "20px",
      },
      "& h5": {
        fontWeight: "600",
        marginLeft: "10px",
      },
    },
  },
}));

export default function GraphScore({ categoryData, type }) {
  const classes = useStyles();
  const chartData = {
    series: [
      {
        name: type == "userRegistation" ? "Users" : "Score",
        data: categoryData?.map((item) =>
          type == "userRegistation" ? item?.Users : item?.score
        ),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      grid: {
        show: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#A2FF03"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      colors: ["#DE14FF", "#17565A"],
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "#DE14FF",
          useSeriesColors: false,
        },
      },
      markers: {
        size: 2,
        hover: {
          size: 3,
        },
      },
      tooltip: {
        intersect: true,
        shared: false,
      },

      yaxis: {
        show: true,
        labels: {
          show: true,
        },
        lines: {
          show: false,
        },
        decimalsInFloat: 2,
      },
      xaxis: {
        type: "date",
        categories: categoryData?.map((item) =>
          type == "userRegistation"
            ? item?.date
              ? moment(item?.date).format("ll")
              : `${item?.monthName ? item?.monthName : ""} ${
                  item?.year ? item?.year : ""
                }`
            : moment(item?.date).format("ll")
        ),
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      fill: {
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.55,
          gradientToColors: [
            "rgba(222, 20, 255, 0.45)",
            "linear-gradient(180deg, #17565A 0%, rgba(23, 86, 90, 0.00) 100%)",
          ],
          inverseColors: false,
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100],
        },
      },
    },
  };

  return (
    <Box className={classes.tablemainbox}>
      <Box p={1}>
        <div id="chart">
          <ReactApexChart
            options={chartData?.options}
            series={chartData?.series}
            type="bar"
            height={350}
          />
        </div>
      </Box>
    </Box>
  );
}
