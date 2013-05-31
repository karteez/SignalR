<%@ Page Title="ASP.NET SignalR: Multiple Hub Connections Demo" Language="C#" MasterPageFile="~/SignalR.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Microsoft.AspNet.SignalR.Samples.Hubs.MultipleConnections.Default" %>


<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <ul class="breadcrumb">
        <li><a href="<%: ResolveUrl("~/") %>">SignalR Samples</a> <span class="divider">/</span></li>
        <li class="active">Multiple Hub Connections</li>
    </ul>

    <div class="page-header">
        <h2>Multiple Hub Connections </h2>
        <p>Demonstrates multiple Hub connections, you can click button to add new connection as well as you can also using queryString e.g. ?cons=3 to specify number of connections by default to run.</p>
    </div>

    <p>
        <input type="button" id="addCon" class="btn" value="Add new connection" />
    </p>

    <div id="connections">
    </div>

    <h5>Messages</h5>
    <ul id="messages">
    </ul>


</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="Scripts" runat="server">
    <script src="<%: ResolveUrl("~/signalr/hubs") %>"></script>
    <script src="cons.js"></script>
</asp:Content>
