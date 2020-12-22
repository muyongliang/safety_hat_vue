var data1 = [{
    value: 60,
    name: '暂停合作',
    itemStyle: {
        labelLine: {
            show: true
        },
        label: {
            show: true
        }
    }
}, {
    value: 40,
    name: '合作中',
    itemStyle: {
        labelLine: {
            show: true
        },
        label: {
            show: true
        }
    }
}];
export default {
    data1,
    backgroundColor: '',
    tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [{
            name: '项目概况',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            color: ['#2DD787', '#C3C3C3'],
            data: data1,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: ['#2DD787', '#C3C3C3']
                },
                normal: {
                    label: {
                        show: true,
                    },
                    labelLine: {
                        show: true
                    }
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 14
                    },
                },

            },

        },

    ]
}