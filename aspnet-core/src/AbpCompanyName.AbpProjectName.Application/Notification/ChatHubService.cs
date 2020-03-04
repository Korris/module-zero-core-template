using Abp.Dependency;
using Castle.Core.Logging;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AbpCompanyName.AbpProjectName.Notification
{
    public class ChatHubService : Hub, ITransientDependency
    {

        public ILogger Logger { get; set; }

        public ChatHubService()
        {
            Logger = NullLogger.Instance;
        }

        [EnableCors("localhost")]
        public async Task SendMessage(object message)
        {
            await Clients.All.SendAsync("getMessage", message);
        }
        public async Task Send(object message)
        {
            await Clients.User("1").SendAsync("getMessage", message);
        }

        [EnableCors("localhost")]
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Logger.Debug("A client connected to MyChatHub: " + Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            Logger.Debug("A client disconnected from MyChatHub: " + Context.ConnectionId);
        }
    }
}
