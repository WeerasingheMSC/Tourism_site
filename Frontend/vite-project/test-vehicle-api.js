// Quick test to verify the vehicle API integration
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjhmOWUxMjM0NTY3ODlhYmNkZWYwMSIsImVtYWlsIjoidGVzdEB2ZWhpY2xlb3duZXIuY29tIiwicm9sZSI6InZlaGljbGUtb3duZXIiLCJpYXQiOjE3NTUxNjE0ODksImV4cCI6MTc1NTI0Nzg4OX0.KQR5nAKM7HIpIOUm5VPnm0Ub33BYmrB5qxSRQYhyQfc';

// Set the token in localStorage for the browser session
localStorage.setItem('token', testToken);

console.log('Test token set in localStorage. You can now test vehicle registration and dashboard.');
console.log('To test:');
console.log('1. Go to http://localhost:5174/vehicle-register');
console.log('2. Fill out the form and submit');
console.log('3. Check http://localhost:5174/vehicle-owner-dashboard to see the registered vehicle');
