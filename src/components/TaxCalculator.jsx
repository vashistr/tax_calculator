import { useEffect } from 'react';
import { useState } from 'react';
import TaxCalculated from './TaxCalculated';
import './TaxCalculator.css';
import spinner from '../assets/spinner.svg';

const TaxCalculator = () => {
  // input fields 
  // --- instead we could have used useRef() and use ref.current.value to fetch the value from input fields
  const [tax, setTax] = useState(0);
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [error, setError] = useState(null);
  const [year, setYear] = useState('2019');
  const [salary, setSalary] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [taxBracket, setTaxBracket] = useState();
  const [taxPerSlab, setTaxPerSlab] = useState();
  const [effectiveTax, setEffectiveTax] = useState();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  // to remove extra spaces (if there)
  const isEnteredLNameValid = lName.trim() !== '';
  const isEnteredFNameValid = fName.trim() !== '';
  const isEnteredSalaryValid = salary !== '';

  // to set the form validity
  useEffect(() => {
    if (isEnteredFNameValid && isEnteredLNameValid && isEnteredSalaryValid) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
  }, [isEnteredFNameValid, isEnteredLNameValid, isEnteredSalaryValid])

  // fetch api data
  const fetchData = async () => {
    setError(null)
    try {
      const data = await fetch(`http://localhost:5001/tax-calculator/brackets/${year}`).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res)
          setError("Status" + res.status + "Due to" + res.statusText)
        }
      }).then((dataTax) => {
        setTaxBracket(dataTax.tax_brackets);
        setLoading(false)
        setIsCalculated(true);
        return dataTax;
      }).catch((err) => {
        console.log(err)
        setError(err.message)
        setLoading(false);
      });

      if (data) {
        calculateTax();
      }
    } catch (error) {
      console.log(error)
      setError(error.message)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [])

  /*
  *** this function will loop through the tax-brackets coming from api ***
  *** calculate total marginal tax and also for each slab and store them in states *** 
  */
  const calculateTax = () => {
    let tempTax = 0;
    let tempTaxPerSlab = [];
    let tempEffectiveTax = 0;

    // *** when max salary is not given - max salary = input salary ***
    if (taxBracket[taxBracket.length - 1].min < salary) taxBracket[taxBracket.length - 1].max = salary;

    for (let i = 0; i < taxBracket.length; i++) {
      if (salary < taxBracket[i].max) { // when salary lies in range
        tempTax += (salary - taxBracket[i].min) * taxBracket[i].rate;
        // calculate tax per slab and push to temp arr
        tempTaxPerSlab.push((salary - taxBracket[i].min) * taxBracket[i].rate)
        break;
      }
      else { // when salary is not in range
        tempTax += (taxBracket[i].max - taxBracket[i].min) * taxBracket[i].rate;
        // calculate tax per slab and push to temp arr
        tempTaxPerSlab.push((taxBracket[i].max - taxBracket[i].min) * taxBracket[i].rate);
      }
    }
    // calculate effective rate
    tempEffectiveTax = (tempTax / salary) * 100;

    // set states
    setTax(tempTax);
    setTaxPerSlab(tempTaxPerSlab);
    setEffectiveTax(tempEffectiveTax);
  }

  // input handlers
  const fNameInputChangeHandler = (event) => {
    setFName(event.target.value)
    setIsCalculated(false)
    setError(null)
  }
  const lNameInputChangeHandler = (event) => {
    setLName(event.target.value)
    setIsCalculated(false)
    setError(null)
  }
  const salaryInputChangeHandler = (event) => {
    setSalary(parseInt(event.target.value))
    setIsCalculated(false)
    setError(null)
  }
  const yearInputChangeHandler = (event) => {
    setYear(event.target.value)
    setIsCalculated(false)
    setError(null)
  }

  // form submission handler
  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setIsCalculated(false);
    setLoading(true);
    setError(null);

    if (!isEnteredFNameValid && !isEnteredLNameValid && !isEnteredSalaryValid) {
      return;
    }
    fetchData();
  }

  return (
    <div>
      {loading ? <img className='spinner' src={spinner} alt="spinner" /> : null}
      <div className='marginRight'>
        <p className='heading'>Your Tax Calculator</p>
        <form onSubmit={formSubmissionHandler}>
          <div className='form-control'>
            <input type="text" className='formInput' id="fName" onChange={fNameInputChangeHandler} placeholder="Enter First Name" />
          </div>
          <br />

          <div className='form-control'>
            <input type="text" className='formInput' id="lName" onChange={lNameInputChangeHandler} placeholder="Enter Last Name" />
          </div>
          <br />

          <div className='form-control'>
            <input type="number" className='formInput' id="salary" onChange={salaryInputChangeHandler} placeholder="Enter Annual Salary (CAD)" />
          </div>
          <br />

          <div className='form-control'>
            <select className='formInput' id="year" name="selectedYear" onChange={yearInputChangeHandler}>
              <option defaultValue={2019} value={2019}>2019</option>
              <option value={2020}>2020</option>
              <option value={2021}>2021</option>
            </select>
          </div>
          <br />

          <div className='form-actions'>
            <button className='submitBtn' disabled={!isFormValid}>Calculate!</button>
          </div>
        </form>
      </div>
      {isFormValid && isCalculated ?
        <TaxCalculated fName={fName} lName={lName} tax={tax} effectiveTax={effectiveTax} year={year} taxPerSlab={taxPerSlab} salary={salary} />
        : null}
      {salary && !loading && error ? <p className='err'>{error}</p> : null}
    </div>
  );
}

export default TaxCalculator;
