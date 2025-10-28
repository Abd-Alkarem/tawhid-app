import { encryption } from './encryption';

/**
 * Migrate old unencrypted user accounts to new encrypted format
 * Run this once to upgrade all existing accounts
 */
export const migrateUsersToEncrypted = async () => {
  try {
    const users = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
    
    if (users.length === 0) {
      console.log('No users to migrate');
      return { success: true, migrated: 0 };
    }

    const migratedUsers = [];
    let migratedCount = 0;

    for (const user of users) {
      // Check if already encrypted by trying to decrypt
      let isEncrypted = false;
      try {
        const decrypted = encryption.decrypt(user.email);
        if (decrypted && decrypted.includes('@')) {
          isEncrypted = true;
        }
      } catch (e) {
        isEncrypted = false;
      }

      if (!isEncrypted) {
        // Migrate this user
        console.log(`Migrating user: ${user.email}`);
        
        const migratedUser = {
          ...user,
          name: encryption.encrypt(user.name),
          email: encryption.encrypt(user.email),
          phone: user.phone ? encryption.encrypt(user.phone) : null,
          password: await encryption.hashPassword(user.password), // Hash the password
          verified: true // Mark old accounts as verified
        };
        
        migratedUsers.push(migratedUser);
        migratedCount++;
      } else {
        // Already encrypted, keep as is
        migratedUsers.push(user);
      }
    }

    // Save migrated users
    localStorage.setItem('tawhid_users', JSON.stringify(migratedUsers));
    
    console.log(`✅ Migration complete! Migrated ${migratedCount} users.`);
    return { success: true, migrated: migratedCount, total: users.length };
    
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reset all user data and start fresh
 * WARNING: This will delete all accounts!
 */
export const resetAllUsers = () => {
  if (window.confirm('⚠️ WARNING: This will delete ALL user accounts! Are you sure?')) {
    localStorage.removeItem('tawhid_users');
    localStorage.removeItem('tawhid_current_user');
    console.log('✅ All user data has been reset');
    window.location.reload();
  }
};

/**
 * Export users for backup (decrypted)
 */
export const exportUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
    const decryptedUsers = users.map(user => {
      try {
        return {
          id: user.id,
          name: encryption.decrypt(user.name) || user.name,
          email: encryption.decrypt(user.email) || user.email,
          phone: user.phone ? (encryption.decrypt(user.phone) || user.phone) : null,
          role: user.role,
          createdAt: user.createdAt,
          verified: user.verified
        };
      } catch (e) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
          verified: user.verified
        };
      }
    });

    const dataStr = JSON.stringify(decryptedUsers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tawhid-users-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('✅ Users exported successfully');
  } catch (error) {
    console.error('Export error:', error);
  }
};

// Make functions available in console for debugging
if (typeof window !== 'undefined') {
  window.tawhidMigration = {
    migrate: migrateUsersToEncrypted,
    reset: resetAllUsers,
    export: exportUsers
  };
  
  console.log(`
🔧 Tawhid Migration Tools Available:
  
  window.tawhidMigration.migrate()  - Migrate old accounts to encrypted format
  window.tawhidMigration.reset()    - Reset all user data (WARNING: Deletes everything!)
  window.tawhidMigration.export()   - Export users as JSON backup
  `);
}
