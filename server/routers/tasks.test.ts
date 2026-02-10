import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./index";

describe("Tasks Router", () => {
  const caller = appRouter.createCaller({});

  beforeEach(async () => {
    const tasks = await caller.tasks.list();
    for (const task of tasks) {
      await caller.tasks.delete({ id: task.id });
    }
  });

  describe("create", () => {
    it("should create a task with required fields", async () => {
      const task = await caller.tasks.create({
        title: "Test Task",
      });

      expect(task).toMatchObject({
        title: "Test Task",
        status: "pending",
        priority: "medium",
        description: null,
      });
      expect(task.id).toBeDefined();
      expect(task.created_at).toBeInstanceOf(Date);
    });

    it("should create a task with all fields", async () => {
      const task = await caller.tasks.create({
        title: "Complete Task",
        description: "This is a complete task",
        priority: "high",
      });

      expect(task).toMatchObject({
        title: "Complete Task",
        description: "This is a complete task",
        priority: "high",
        status: "pending",
      });
    });

    it("should create tasks with incrementing IDs", async () => {
      const task1 = await caller.tasks.create({ title: "Task 1" });
      const task2 = await caller.tasks.create({ title: "Task 2" });

      expect(task2.id).toBeGreaterThan(task1.id);
    });
  });

  describe("list", () => {
    it("should return all tasks in the list", async () => {
      const initialTasks = await caller.tasks.list();
      const initialCount = initialTasks.length;

      await caller.tasks.create({ title: "New Task" });
      
      const tasks = await caller.tasks.list();
      expect(tasks.length).toBe(initialCount + 1);
    });

    it("should include newly created tasks", async () => {
      const initialTasks = await caller.tasks.list();
      const initialCount = initialTasks.length;

      await caller.tasks.create({ title: "Task A" });
      await caller.tasks.create({ title: "Task B" });
      await caller.tasks.create({ title: "Task C" });

      const tasks = await caller.tasks.list();
      expect(tasks.length).toBe(initialCount + 3);
    });
  });

  describe("getById", () => {
    it("should return a task by ID", async () => {
      const created = await caller.tasks.create({ title: "Find Me" });
      const found = await caller.tasks.getById({ id: created.id });

      expect(found).toMatchObject({
        id: created.id,
        title: "Find Me",
      });
    });

    it("should return null for non-existent ID", async () => {
      const found = await caller.tasks.getById({ id: 99999 });
      expect(found).toBeNull();
    });
  });

  describe("update", () => {
    it("should update task title", async () => {
      const task = await caller.tasks.create({ title: "Original" });
      const updated = await caller.tasks.update({
        id: task.id,
        title: "Updated",
      });

      expect(updated.title).toBe("Updated");
    });

    it("should update task status", async () => {
      const task = await caller.tasks.create({ title: "Status Test" });
      
      const inProgress = await caller.tasks.update({
        id: task.id,
        status: "in_progress",
      });
      expect(inProgress.status).toBe("in_progress");

      const completed = await caller.tasks.update({
        id: task.id,
        status: "completed",
      });
      expect(completed.status).toBe("completed");
    });

    it("should update task priority", async () => {
      const task = await caller.tasks.create({ title: "Priority Test" });
      
      const updated = await caller.tasks.update({
        id: task.id,
        priority: "high",
      });
      expect(updated.priority).toBe("high");
    });

    it("should throw error for non-existent task", async () => {
      await expect(
        caller.tasks.update({ id: 99999, title: "Nope" })
      ).rejects.toThrow("Task not found");
    });
  });

  describe("delete", () => {
    it("should delete a task", async () => {
      const task = await caller.tasks.create({ title: "Delete Me" });
      const result = await caller.tasks.delete({ id: task.id });

      expect(result).toEqual({ success: true });

      const tasks = await caller.tasks.list();
      expect(tasks.find((t) => t.id === task.id)).toBeUndefined();
    });

    it("should throw error for non-existent task", async () => {
      await expect(
        caller.tasks.delete({ id: 99999 })
      ).rejects.toThrow("Task not found");
    });
  });
});
