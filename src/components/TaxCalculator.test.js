import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaxCalculator from './TaxCalculator';


describe('TaxCalculator', () => {
    test('renders tax calculator link', () => {
        // Arrange
        render(<TaxCalculator />);

        // Act
        const linkElement = screen.getByText(/tax calculator/i);

        // Assert
        expect(linkElement).toBeInTheDocument();
    });

    // 
    test('renders all basic fields', () => {
        // Arrange
        render(<TaxCalculator />);

        // Assert
        expect(screen.getByRole("button", { name: /calculate/i })).toBeInTheDocument();
    });

    test('enter input fields', () => {
        // Arrange
        render(<TaxCalculator />);

        //Act
        userEvent.type(fName, "testFName");
        userEvent.type(lName, "testLName");
        userEvent.type(salary, "1000");

        // Assert
        expect(fName.value).toMatch("testFName");
        expect(lName.value).toMatch("testLName");
        expect(salary.value).toMatch("1000");
    });


    test('fetches tax if call succeeds', async () => {
        // Arrange
        render(<TaxCalculator />);
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => [{ max: 1000, min: 10, rate: 0.15 }]
        })

        // Act
        const btnElement = screen.getByRole('button');
        fireEvent.click(btnElement);

        // Assert
        const linkElement = await screen.findByText(/tax/i);
        expect(linkElement).toBeInTheDocument();
    })


})

