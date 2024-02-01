// Initializing range slider
$(document).ready(function () {

  let loanAmtVal = 100000;
  let durationVal = 12;
  let interestVal = 9;
  let chart;
  let totalAmountPayable;
  let totalInterestPayable;
  let amountInput = $('#loan-amount')
  let durationInput = $('#loan-duration')
  let interestInput = $('#rate-of-interest')

  // Amount
  {
    let instance;
    $("#amount").ionRangeSlider({
      skin: "round",
      grid: false,
      min: 100000,
      max: 9000000,
      from: 100000,
      prefix: "₹",
      onStart: function (data) {
        $('#loan-amount').prop('value', data.from)
      },
      onChange: function (data) {
        loanAmtVal = data.from
        $('#loan-amount').prop('value', data.from)
        EMICalculate()
      },
      onFinish: function (data) {
        chart.destroy()
        EMICalculate()
        createChart()
      }
    });
    instance = $('#amount').data('ionRangeSlider')
    amountInput.on('input', (e) => {
      let val = e.target.value;
      loanAmtVal = val
      instance.update({
        from: val
      })
      EMICalculate()
      createChart()
    })
  }
  // Duration
  {
    let instance;
    $("#duration").ionRangeSlider({
      skin: "round",
      grid: false,
      min: 12,
      max: 72,
      from: 1,
      postfix: "months",
      onStart: function (data) {
        $('#loan-duration').prop('value', data.from)
      },
      onChange: function (data) {
        durationVal = data.from
        $('#loan-duration').prop('value', data.from)
        EMICalculate()
      },
      onFinish: function (data) {
        EMICalculate()
        chart.destroy()
        createChart()
      }
    });
    instance = $('#duration').data('ionRangeSlider')
    durationInput.on('input', (e) => {
      let val = e.target.value;
      durationVal = val
      instance.update({
        from: val
      })
      EMICalculate()
    })
  }
  // Interest
  {
    let instance;
    $("#interest").ionRangeSlider({
      skin: "round",
      grid: false,
      min: 9,
      max: 26,
      from: 9,
      onStart: function (data) {
        $('#rate-of-interest').prop('value', data.from)
      },
      onChange: function (data) {
        interestVal = data.from
        $('#rate-of-interest').prop('value', data.from)
        EMICalculate()
      },
      onFinish: function (data) {
        chart.destroy()
        EMICalculate()
        createChart()
      }
    });
    instance = $('#interest').data('ionRangeSlider')
    interestInput.on('input', (e) => {
      let val = e.target.value;
      interestVal = val
      console.log(interestVal)
      EMICalculate()
      instance.update({
        from: `${val}`
      })
      chart.destroy()
      createChart()
    })
  }

  function EMICalculate() {
    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1],
    let montlyRoi = interestVal / 12 / 100
    console.log(montlyRoi)
    let emi = eval((loanAmtVal * montlyRoi * (1 + montlyRoi) ** durationVal) / (((1 + montlyRoi) ** durationVal) - 1))

    $('.monthly-emi-display').prop('innerText', `₹${Math.round(emi).toLocaleString("en-IN")}*`)
    totalAmountPayable = emi * durationVal
    totalInterestPayable = totalAmountPayable - loanAmtVal

    $('#total-amount-payable').prop('innerText', `₹${Math.round(totalAmountPayable).toLocaleString("en-IN")}*`)
    $('#total-interest-payable').prop('innerText', `₹${Math.round(totalInterestPayable).toLocaleString("en-IN")}*`)
  }
  EMICalculate()

  const ctx = document.getElementById('myChart');
  function createChart() {

    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Total Amount Payable',
          'Total Interest Payable'
        ],
        datasets: [{
          label: 'Amount Payable',
          data: [totalAmountPayable, totalInterestPayable],
          backgroundColor: [
            'blue',
            'yellow'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        rotation: 100,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  createChart();

})


