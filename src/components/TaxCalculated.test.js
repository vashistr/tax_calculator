import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TaxCalculated from './TaxCalculated';


describe('TaxCalculated', () => {
    test('renders tax calculated link', () => {
        // Arrange
        render(<TaxCalculated />);

        // Act
        const congratulationsElement = screen.getByText(/congratulations/i);

        // Assert
        expect(congratulationsElement).toBeInTheDocument();
    });

    test('renders tax calculated fields', () => {
        // Arrange
        const fName="testFName";
        const lName="testLName";
        const tax=100
        const effectiveTax=23
        const year=2019
        const taxPerSlab=[105,10,10]
        const salary=300
        render(<TaxCalculated fName={fName} lName={lName} tax={tax} effectiveTax={effectiveTax} year={year} taxPerSlab={taxPerSlab} salary={salary} />);

        // Act
        const fNameElement = screen.getByText(/testFName/i);
        const taxElement = screen.getByText(/100/i);
        const yearElement = screen.getByText(/2019/i);
        const salaryElement = screen.getByText(/300/i);
        const lNameElement = screen.getByText(/testLName/i);
        const taxPerSlabElement = screen.getByText(/105/i);
        const effectiveTaxElement = screen.getByText(/23/i);

        // Assert
        expect(fNameElement).toBeInTheDocument();
        expect(taxElement).toBeInTheDocument();
        expect(yearElement).toBeInTheDocument();
        expect(salaryElement).toBeInTheDocument();
        expect(lNameElement).toBeInTheDocument();
        expect(taxPerSlabElement).toBeInTheDocument();
        expect(effectiveTaxElement).toBeInTheDocument();
    });

    test('currency format', () => {
        // Arrange
        const fName="testFName";
        const lName="testLName";
        const tax=100
        const effectiveTax=23
        const year=2019
        const taxPerSlab=[105,10,10]
        const salary=300
        render(<TaxCalculated fName={fName} lName={lName} tax={tax} effectiveTax={effectiveTax} year={year} taxPerSlab={taxPerSlab} salary={salary} />);

        // Act
        
    })

})

