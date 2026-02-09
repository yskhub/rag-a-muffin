"""
In-Memory Session Storage - 100% FREE
No Redis needed - uses Python dictionary
Perfect for free tier deployments
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from collections import defaultdict

class MemoryService:
    """
    FREE in-memory conversation storage
    
    Features:
    - No external service required
    - Automatic session cleanup
    - Configurable history limit
    
    Limitations:
    - Sessions lost on server restart
    - Single server only (no horizontal scaling)
    """
    
    def __init__(self):
        # Store conversations in memory
        self.conversations: Dict[str, List[Dict]] = defaultdict(list)
        self.last_activity: Dict[str, datetime] = {}
        
        # Configuration
        self.TIMEOUT_MINUTES = 60  # Sessions expire after 1 hour
        self.MAX_MESSAGES = 20     # Keep last 20 messages per session
        
        print("✅ Memory service initialized (In-memory - FREE)")
    
    def add_message(
        self, 
        session_id: str, 
        role: str, 
        content: str
    ) -> None:
        """
        Add message to conversation history
        Automatically trims old messages
        """
        self.conversations[session_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        
        # Update last activity
        self.last_activity[session_id] = datetime.now()
        
        # Keep only last N messages (memory optimization)
        if len(self.conversations[session_id]) > self.MAX_MESSAGES:
            self.conversations[session_id] = \
                self.conversations[session_id][-self.MAX_MESSAGES:]
    
    def get_history(
        self, 
        session_id: str, 
        limit: int = 10
    ) -> List[Dict]:
        """
        Get conversation history for a session
        Triggers cleanup of old sessions
        """
        # Clean up old sessions
        self._cleanup_old_sessions()
        
        messages = self.conversations.get(session_id, [])
        return messages[-limit:] if messages else []
    
    def clear_session(self, session_id: str) -> bool:
        """Clear specific session"""
        cleared = False
        if session_id in self.conversations:
            del self.conversations[session_id]
            cleared = True
        if session_id in self.last_activity:
            del self.last_activity[session_id]
        return cleared
    
    def _cleanup_old_sessions(self) -> int:
        """
        Remove sessions inactive for > TIMEOUT_MINUTES
        Returns number of sessions cleaned
        """
        now = datetime.now()
        timeout = timedelta(minutes=self.TIMEOUT_MINUTES)
        
        expired_sessions = [
            session_id 
            for session_id, last_time in self.last_activity.items()
            if now - last_time > timeout
        ]
        
        for session_id in expired_sessions:
            self.clear_session(session_id)
        
        return len(expired_sessions)
    
    def get_stats(self) -> Dict:
        """Get memory statistics"""
        total_messages = sum(
            len(msgs) for msgs in self.conversations.values()
        )
        return {
            "active_sessions": len(self.conversations),
            "total_messages": total_messages,
            "timeout_minutes": self.TIMEOUT_MINUTES,
            "max_messages_per_session": self.MAX_MESSAGES,
            "cost": "$0.00"
        }
    
    def get_session_info(self, session_id: str) -> Optional[Dict]:
        """Get info about a specific session"""
        if session_id not in self.conversations:
            return None
        
        return {
            "session_id": session_id,
            "message_count": len(self.conversations[session_id]),
            "last_active": self.last_activity.get(session_id, "unknown")
        }
