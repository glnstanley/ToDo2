namespace ToDo2.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using ToDo2.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<ToDo2.Models.ToDoContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ToDo2.Models.ToDoContext context )
        {
            var r = new Random();
            var items = Enumerable.Range(1, 50).Select(o => new Todo 
            {
                DueDate = new DateTime(2012, r.Next(1, 12), r.Next(1, 28)),
                Priority = (byte)r.Next(10),
                Text = o.ToString()
            }).ToArray();
            context.Todoes.AddOrUpdate(item => new { item.Text }, items);
        }
    }
}
