import React from "react";

import "./css/TeamSidebar.css";

class TeamSidebar extends React.Component{
    render(){
        const {currTeam, onChangeView, currView} = this.props;

        // only show the first few characters of the team name
        const teamName = currTeam.teamName ? 
            currTeam.teamName.length < 10 ? currTeam.teamName : currTeam.teamName.substring(0, 10) + "..." 
            : "";
        return(
            <div className="sidebar-container">
                <h3 className="sidebar-text side-team-name">{teamName}</h3>
                <h3 id={0} className="sidebar-text view-option" onClick={onChangeView}
                    style={{backgroundColor: parseInt(currView, 10) === 0 ? "#373F51" : "#A9BCD0"}}>Chat</h3>
                <h3 id={1} className="sidebar-text view-option" onClick={onChangeView}
                    style={{backgroundColor: parseInt(currView, 10) === 1 ? "#373F51" : "#A9BCD0"}}>Notes</h3>
                <h3 id={2} className="sidebar-text view-option" onClick={onChangeView}
                    style={{backgroundColor: parseInt(currView, 10) === 2 ? "#373F51" : "#A9BCD0"}}>Todos</h3>
                <h3 id={3} className="sidebar-text view-option" onClick={onChangeView}
                    style={{backgroundColor: parseInt(currView, 10) === 3 ? "#373F51" : "#A9BCD0"}}>Events</h3>
            </div>
        )
    }
}

export default TeamSidebar;