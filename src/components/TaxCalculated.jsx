import './TaxCalculated.css';

const TaxCalculated = (props) => {
    // format curency
    const currencyFormat = (num) => {
        return '$' + num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className='marginRight'>
            <div className='taxDetails'>
                <h1>Congratulations {props.fName + ' ' + props.lName} ! Your tax has been calculated!</h1>
                <p><u>For Year:</u> {props.year}</p>
                <p><u>Annual Salary:</u> {currencyFormat(props.salary)}</p>
                <h3><u>Tax Per Slab</u></h3>
                {props.taxPerSlab?.map((slab, index) => {
                    return (
                        <p key={index}>Slab {index + 1}: {currencyFormat(slab)}</p>
                    )
                })}
                <p><u>Total Marginal Tax:</u> {currencyFormat(props.tax)}</p>
                <p><u>Total Effective Rate:</u> {props.effectiveTax?.toFixed(2)}%</p>
            </div>
        </div>
    );
}

export default TaxCalculated;
