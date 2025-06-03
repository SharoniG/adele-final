

/* 
  ...allowedRoles) -> takes al the arguments passed to the function and put them into an  array called allowedRoles 
  in our code for example authorize('admin','user') allowedRoles = ['admin', 'user']
 */
  function authorize(...allowedRoles) { 
    return (req, res, next) => {
      const { role, id: userId } = req.user || {}; // Extract role and user ID from the authenticated token
      const targetId = req.params.id; // The target user ID from the request parametes (users/:id)
  
      // console.log(role);
      //console.log(userId);
      //console.log(targetId)
  
      // Role -> guest 
      if (allowedRoles.includes('guest')) {
        return next();
      }
  
      // Role -> Admin 
      if (role === 'admin' && allowedRoles.includes('admin')) {
        return next();
      }
  
      // Regular user - Allow only if accessing their own data
      if (role === 'user' && allowedRoles.includes('user')) {
        if (userId === targetId) {
          return next();
        }
  
      // If a user is trying to perform an action they don't have permission for
        return res.status(403).json({ message: 'Forbidden: only self' });
      }
  
      //Deny access if none of the above match
      return res.status(403).json({ message: 'Forbidden'});
    };
  }
  
  
  export default authorize;