import time

from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """Django command to pause execution till db is ready"""

    def handle(self, *args, **options):
        self.stdout.write('Waiting for db...')
        while True:
            try:
                connections['default'].ensure_connection()
                break
            except OperationalError:
                self.stdout.write('DB is not ready, waiting 1 sec...')
                time.sleep(1)

        self.stdout.write(self.style.SUCCESS('DB is ready!'))
