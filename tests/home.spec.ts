import { test, expect, type Page, Request, ConsoleMessage, Error } from '@playwright/test';

test('Visual Comparision @HOME', async ({ page }: { page: Page }) => {
    await page.goto('/');
    await expect.soft(page).toHaveScreenshot();
});

test('No 404 errors and no console errors', async ({ page }: { page: Page }) => {

    const notFoundRequests: Request[] = [];

    page.on('request', async (request: Request) => {

        const response = await request.response();
        const status = response?.status();
        if(status === 404){
            notFoundRequests.push(request);
        }
    });

    // Check for failed errors
    const failedRequests: Request[] = [];
    page.on('requestfailed', (request: Request) => {
        console.log(request.url() + ' ' + request.failure().errorText);
        failedRequests.push(request)
    });

    const exceptions: Error[] = [];
    page.on('pageerror', (exception: Error) => {
        console.log(`Uncaught exception: "${exception}"`);
        exceptions.push(exception)
    });

    // Capture console errors
    const consoleErrors: string[] = [];
    page.on('console', (message: ConsoleMessage) => {
        if (message.type() === 'error'){
            consoleErrors.push(message);
        }
    });

    // Navigate to the URL
    await page.goto('/');

    await page.waitForLoadState();
    
    expect(exceptions.length).toBe(0, 'No exceptions should be present');
    
    expect(failedRequests.length).toBe(0, 'No failed request should be present');
    
    expect(notFoundRequests.length).toBe(0, 'No 404 response should be present');

    expect(consoleErrors.length).toBe(0, 'No console errors should be present');
});