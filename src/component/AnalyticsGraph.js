import React, { useEffect, useMemo, useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
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

const AnalyticsGraph = ({ categoryData, type }) => {
  const classes = useStyles();

  const [chartData, setChartData] = useState();
  const datalist = useMemo(() => {
    if (categoryData && categoryData.length > 0) {
      setChartData({
        series: [
          {
            name:
              type === "history"
                ? `WON: ${parseFloat(
                    categoryData?.reduce((a, b) => a + (b?.WON || 0), 0)
                  ).toFixed(3)}`
                : `Withdrawal: ${parseFloat(
                    categoryData?.reduce((a, b) => a + (b?.withdraw || 0), 0)
                  ).toFixed(3)}`,
            data:
              type === "history"
                ? categoryData && categoryData?.map((item) => item?.WON)
                : categoryData && categoryData?.map((item) => item?.withdraw),
          },
          {
            name:
              type === "history"
                ? `LOSS: ${parseFloat(
                    categoryData?.reduce((a, b) => a + (b?.LOSS || 0), 0)
                  ).toFixed(3)}`
                : `Deposit: ${parseFloat(
                    categoryData?.reduce((a, b) => a + (b?.buy || 0), 0)
                  ).toFixed(3)}`,
            data:
              type === "history"
                ? categoryData && categoryData?.map((item) => item?.LOSS)
                : categoryData && categoryData?.map((item) => item?.buy),
          },
          ...(type && type === "rejectFund"
            ? [
                {
                  name: `Rejected: ${parseFloat(
                    categoryData?.reduce((a, b) => a + (b?.rejected || 0), 0)
                  ).toFixed(3)}`,
                  data:
                    categoryData && categoryData?.map((item) => item?.rejected),
                },
              ]
            : []),
        ],
        options: {
          chart: {
            height: 350,
            type: "area",
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
          colors: ["#DE14FF", "#17565A", "#ff0000"],
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
              item?.monthName
                ? `${item?.monthName} ${item?.year}`
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
      });
    }
  }, [categoryData]);

  return (
    <Box>
      <Box className={classes.tablemainbox}>
        <Box p={1}>
          <div id="chart">
            <ReactApexChart
              options={chartData?.options}
              series={chartData?.series}
              type="line"
              height={350}
            />
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsGraph;
