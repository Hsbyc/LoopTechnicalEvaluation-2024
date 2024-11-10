import { test, expect } from '@playwright/test';

class WorkRequestsPageTests {
    constructor(page) {
      this.page = page;
      this.newRequestHeader = page.getByRole('heading', { name: 'New Requests' });
      this.backlogHeader = page.getByRole('heading', { name: 'Backlog' });
      this.inProgressHeader = page.getByRole('heading', { name: 'In Progress' });
      this.completedHeader = page.getByRole('heading', { name: 'Completed' });
      this.newRequestWork = page.getByText('[Example] Laptop setup for');
      this.inProgressWork = page.getByText('[Example] Password not working');
      this.completedWork = page.getByText('[Example] New keycard for');
      this.newRequestWorkContext = page.getByRole('link', { name: 'Work Requests New Requests' });
      this.inProgressWorkContext = page.getByRole('link', { name: 'Work Requests In Progress' });
      this.completedWorkContext = page.getByRole('link', { name: 'Work Requests Completed' });
    }

  async verifyWorkRequests(workRequests, expectedTags){
    await expect(this.newRequestHeader).toBeVisible();
    await expect(this.backlogHeader).toBeVisible();
    await expect(this.inProgressHeader).toBeVisible();
    await expect(this.completedHeader).toBeVisible();

    if (workRequests == '[Example] Laptop setup for new hire'){
      await expect(this.newRequestWork).toBeVisible();
      await this.newRequestWork.click();
      await expect(this.newRequestWorkContext).toBeVisible();

    } else if ( workRequests == '[Example] Password not working'){
      await expect(this.inProgressWork).toBeVisible();
      await this.inProgressWork.click();
      await expect(this.inProgressWorkContext).toBeVisible();

    } else if (workRequests == '[Example] New keycard for Daniela V'){
      await expect(this.completedWork).toBeVisible();
      await this.completedWork.click();
      await expect(this.completedWorkContext).toBeVisible();
      
    } else {
      const throwError = () => {
        throw new Error();
      };
      await expect(throwError).toThrow(workRequests + ' is not part of the application');
    }

    const priorityLevel = await this.page.getByLabel('Priority level? ' + expectedTags[0]);
    const statusLevel = await this.page.getByLabel('Effort level? ' + expectedTags[1]);
    const typeWorkRequest = await this.page.getByLabel('Type (Work Requests - IT) ' + expectedTags[2]);
    const taskProcess = await this.page.getByLabel('Task Progress ' + expectedTags[3]);

    await priorityLevel.waitFor({ state: 'visible' });
    await statusLevel.waitFor({ state: 'visible' });
    await typeWorkRequest.waitFor({ state: 'visible' });
    await taskProcess.waitFor({ state: 'visible' });

    await expect(priorityLevel).toBeVisible();
    await expect(statusLevel).toBeVisible();
    await expect(typeWorkRequest).toBeVisible();
    await expect(taskProcess).toBeVisible();

    if (priorityLevel && statusLevel && typeWorkRequest && taskProcess) {
      console.log("Work request verification is completed!");
    } else {
      console.log('Test failed..')
    }
  }
}

export default WorkRequestsPageTests;