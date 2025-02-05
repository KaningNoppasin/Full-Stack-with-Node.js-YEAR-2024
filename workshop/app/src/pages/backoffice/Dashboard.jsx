import BackOffice from "../../components/BackOffice";
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS , CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from "chart.js"
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard(){
    const [dataApi, setDataApi] = useState({
        labels : [
            "Jan", "Feb", "Mar" ,"Api", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: 'Monthly Sales',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1 )',
                borderWidth: 1
            }
        ]
    });


    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await axios.get(config.apiPath + "/api/sale/dashboard",config.headers())
            .then(res => {
                if (res.data.results !== undefined){
                    let data = [];
                    for (let i = 0; i < res.data.results.length; i++) {
                        data.push(res.data.results[i].sumPrice)
                    }

                    setDataApi({
                        labels : [
                            "Jan", "Feb", "Mar" ,"Api", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ],
                        datasets: [
                            {
                                label: 'Monthly Sales',
                                data: data,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1 )',
                                borderWidth: 1
                            }
                        ]
                    })
                }
            })
    }

    // const data = {
    //     labels : [
    //         "Jan", "Feb", "Mar" ,"Api", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    //     ],
    //     datasets: [
    //         {
    //             label: 'Monthly Sales',
    //             data: [10, 20, 30, 40 ,50, 60 ,70, 80, 90, 100, 110, 120],
    //             backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //             borderColor: 'rgba(75, 192, 192, 1 )',
    //             borderWidth: 1
    //         }
    //     ]
    // }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title:{
                display: true,
                text: 'Monthly Sales Data'
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
    return(
        <>
        <BackOffice>
            <Bar data={dataApi} options={options}></Bar>
        </BackOffice>
        </>
    )
}

export default Dashboard;