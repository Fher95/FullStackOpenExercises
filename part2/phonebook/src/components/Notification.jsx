const Notification = ({ notification }) => {
    if (!notification) return null;
    let className = notification.success ?  'green-alert' : 'red-alert';
    return (
        <div className={className}>
            {notification.message}
        </div>
    )
}

export default Notification;